_.define.kind("ocean", function(supermodel) {
    return {

        harbors: null
        , mainharbor: null
        , config: null
        , dirty: false

        , dirtytimer: 0
        , statetimer: 0

        , disconnected: null

        , docktimeout: 1000 * 15 * 60

        , create: function (loader, harborconfig) {
            this._parent = loader
            loader.ocean = this
            this.harbors = {}

            if (harborconfig) {
                this.load(loader, harborconfig)
            }
        }

        , load: function (loader, harborconfig) {
            var me = this
            me.config = harborconfig

            _.foreach(harborconfig, function (config, name) {
                config.name = name

                if (!config.ocean) {
                    //local harbor
                    //                loader.addrole(name)
                    var harbor = me.harbor(config.name)

                    //initialize harbormaster
                    if (!config.ocean) {
                        var harbormaster = _.make.harbormaster(harbor, harbor.name)
                        harbormaster.setanomcredentials(config.username, config.userpass)
                        harbor.harbormaster = harbormaster
                    }


                    if (config.main) {
                        if (me.mainharbor) { throw "error" }
                        me.mainharbor = harbor
                    }
                }
            })

            this.updatestate(0)
        }

        , destinationinfo: function (destination) {
            return this.config[destination]
        }

        , setdirty: function () {
            if (this.dirty) { return }

            var me = this

            this.dirtytimer = _.timer.waitfor(1, "ocean.setdirty")
                .ontimer(function () {
                    //_.debug("timer start")
                    me.dirty = false
                    if (me._evolution < 0) { return }

                    var ships = []

                    _.foreach(me.harbors, function (harbor) {
                        if (harbor.dirty) {
                            harbor.dirty = false

                            _.foreach(harbor.docks, function (dock) {
                                if (dock.dirty) {
                                    //_.debug("sendship " + harbor.name + ": " + dock.name)
                                    dock.sendship()
                                }
                            })
                        }
                    })

                    if (me.dirty) {
                        this.waitfor(10)
                    }
                })
        }

        , updatestate: function () {
            var me = this

            this.statetimer = _.timer.waitfor(60000, "ocean.updatestate")
                .ontimer(function () {
                    var now = _.timer.now

                    _.foreach(me.harbors, function (harbor) {
                        _.foreach(harbor.docks, function (dock) {
                            if (dock.isdeparturedock) {
                                //check 
                            } else {
                                if (dock.lastactivity + me.docktimeout < now) {
                                    dock.destroy()
                                }
                            }
                        })
                    })

                    if (me._evolution >= 0) {
                        this.waitfor(60000)
                    }
                })

        }

        , harbor: function (name) {
            var harbor = this.harbors[name]

            if (!harbor) {
                harbor = _.make.harbor(this, name, null, _.routes[name])
                this.harbors[name] = harbor
            }

            return harbor
        }

        , forharbor: function (next) {
            _.foreach(this.harbors, next)
        }

        , makedeparturedock: function (dockid) {
            var me = this
            var mainharbor = me.mainharbor

            if (!mainharbor) { throw "mainharbor doesn't exist" }

            var dock = mainharbor.dock(dockid)
            if (dock) { throw "dock already exists" }

            dock = _.make.dock(this.mainharbor, dockid)
                .onconnect(function () {
                    if (mainharbor.disconnected) {
                        if (mainharbor.disconnected[this.key()]) {
                            delete mainharbor.disconnected[this.key()]
                        }

                        if (!_.length(mainharbor.disconnected)) {
                            delete mainharbor.disconnected
                            me.onconnect()
                        }
                    }
                })
                .ondisconnect(function () {
                    var raiseevent = false

                    if (!mainharbor.disconnected) {
                        raiseevent = true
                        mainharbor.disconnected = {}
                    }

                    mainharbor.disconnected[this.key()] = true

                    if (raiseevent) {
                        me.ondisconnect()
                    }
                })

            dock.isdeparturedock = true

            var config = this.config[dockid]
            if (!config) { throw "dock config missing" }

            if (config) {
                dock.shiptype = config.shiptype || "ship"
            }

            return dock
        }

        , sail: function (ship) {
            var me = this
            var destination = ship.retour ? ship.home : ship.destination

            var harbor = me.harbors[destination]
            if (!harbor) {
                return ship.onerror("Unknown harbor")
            }
            this.onarrive(ship)
            harbor.arrive(ship)
        }

        , destroy: function () {
            supermodel.destroy.apply(this, arguments)

            if (this.statetimer) { this.statetimer.destroy() }
            if (this.dirtytimer) { this.dirtytimer.destroy() }

            if (this._evolution != _.enum.evolution.destroy) { return this }
            this.dirty = false

            this._parent.ocean = null
            this._parent = null
            _.foreach(this.harbors, function (harbor) {
                harbor.destroy()
            })

            this.harbors = null
        }

        , onarrive: _.signal()
        , ondepart: _.signal()

        , onconnect: _.signal()
        , ondisconnect: _.signal()
    }
})
