//var sampleshipdata = {
//    dockid: 001
//    , home: "client"
//    , server: "server"

//    , cargo: [
//        {
//            pipeid: 100
//            , action: ""
//            , params: {}
//            , progress: 0
//        }
//        , {
//            pipeid: 100
//            , data: null
//            , progress: 1
//        }
//        , {
//            pipeid: 100
//            , data: null
//            , progress: 100
//        }
//        , {
//            pipeid: 101
//            , error: null
//            , progress: -1
//        }

//        , {
//            pipeid: 301
//            , response: null
//            , progress: 100
//        }
//    ]
//}

//todo: In theory a dock should be able to send as receive. 
//todo: The configuration is now based on classic client/server model, where the client asks and the server response.
//todo: Then again, the client knows best when it can receive data, so for now it's good enough

_.define.aliaskind("dock", function (supermodel) {
    var onconnect = function (me) {
        if (me.connected) { return }
        me.connected = true
        me.onconnect()
    }

    var ondisconnect = function (me) {
        if (!me.connected) { return }
        me.connected = false
        me.ondisconnect()
    }

    return {
        name: ""
        , destination: ""
        , harbor: null

        , pipes: null
        , barrels: null
        , shiptype: undefined
        , ships: null

        , dirty: false
        , lastactivity: 0

        , isdeparturedock: false
        , sessiontoken: ""

        , shipoutcount: 0
        , connected: false

        , timeoutwarningduration: 500

        , create: function (harbor, name) {
            supermodel.create.apply(this, arguments)

            harbor.docks[name] = this

            this.harbor = harbor
            this.name = name
            this.destination = name

            this.pipes = {}
            this.ships = _.make.stacklist(this)
            this.lastactivity = _.timer.now

           
        }

        , loadshell: function (globals, actions) {
            this.shell = _.make.shell(this).load(globals, actions)

            return this
        }

        , pipe: function (id) {
            var me = this
            var pipe = id? this.pipes[id]: null

            if (!pipe) {
                pipe = _.make.pipe(this, id)

                pipe
                    .onbarrel(function (barrel) {
                        me.sendbarrel(barrel)
                    })
                    .onrequest(function (pipe) {
                        if (_.config.debugmode) {
                            var start = _.now()

                            var result = me.doaction(pipe.action, pipe.params)

                            var parsetime = _.now() - start
                            if (parsetime > me.timeoutwarningduration) {
                                _.debug.warn(me, "performance", [me.personuid, pipe.action, pipe.params], "parsetime: " + parsetime)
                            }

                            if ((result instanceof _.kind.pipe)) {
                                pipe.send(result)
                            } else {
                                pipe.close(result)
                            }

                        } else {
                            try {
                                var result = me.doaction(pipe.action, pipe.params)

                                if ((result instanceof _.kind.pipe)) {
                                    pipe.send(result)
                                } else {
                                    pipe.close(result)
                                }

                            } catch (e) {
                                _.debug.error(this, "dock.pipe", e, e.message)
                                pipe.error(e)
                            }
                        }
                        
                    })
                    .ondestroy(function () {
                        delete me.pipes[this.id]
                    })

                this.pipes[pipe.id] = pipe
            }
            return pipe
        }

        , sendship: function () {
            this.lastactivity = _.timer.now

            this.dirty = false

            if (!this.barrels && this.sessiontoken) { return }

            if (!this.ships.length()) {
                if (this.shipoutcount > 0) {
                    ondisconnect(this)
                    return
                }
                this.shipoutcount++

                var ship = this.buildship() 

            } else {
                var ship = this.ships.popfirst()
            }

            if (ship) {
                if (this.barrels) {
                    ship.loadcargo(this.barrels)
                    this.barrels = null
                }

                ship.sail(this)
            }
        }

        , initialize: function () {
            var config = _.config.harbor[this.name]

            this.config = {
                personuid: config.personuid
                , sacgoat: config.sacgoat
                , username: config.username
                , userpass: config.userpass
                , dockid: _.crypto.createsessionid()
            }

            this.dockid = this.config.dockid //this.config.personuid || _.crypto.createsessionid()
        }

        , buildship: function () {
            if (!this.shiptype)  { return }

            var ship = _.make[this.shiptype](this.harbor.name, this.destination)

            if (this.isdeparturedock && !this.config) {
                this.initialize()
            }

            ship.dockid = this.dockid

            if (this.sessiontoken) {
                ship.sessiontoken = this.sessiontoken

            } else {
                if (this.config.sacgoat) {
                    ship.sacgoat = this.config.sacgoat

                } else {
                    ship.username = this.config.username
                    ship.userpass = this.config.userpass
                }
            }

            return ship
        }

        , arrive: function (ship) {
            var me = this
            this.lastactivity = _.timer.now

            if (ship.retour) {
                this.shipoutcount -= 1

//                _.debug("arrive " + (this.barrels ? this.barrels.length : null) + " + " + this.shipoutcount)

                this.sessiontoken = ship.sessiontoken

                if (ship.connectionerror) {
                    if (ship.hascargo()) {
                        if (!this.barrels) { this.barrels = [] }

                        ship.retakecargo(function (barrel) {
                            me.barrels.unshift(barrel)
                        })
                    }
                    ship.destroy()

                    ondisconnect(me)
                    this.sendship()
                    return

                }  else if (!ship.sessiontoken || ship.err) {
                    //The server session doesn't exist. Put barrels back onto the dock for a next ship.
                    this.sessiontoken = ""

                    if (ship.hascargo()) {
                        if (!this.barrels) { this.barrels = [] }

                        ship.retakecargo(function (barrel) {
                            me.barrels.unshift(barrel)
                        })
                    }

                    if (ship.sacgoat || ship.username) {
                        //It seems making the connection failed

                        ship.destroy()
                        _.system.critical(this, "arrive", null, "credentials are missing")
                        return

                    } else {
                        //Try to rebuild serverside session
                        ship.destroy()
                        this.sendship()
                        return
                    }
                } else {
                    if (!this.connected) {
                        onconnect(this)
                    }
                }

            } else {
                this.destination = ship.home
                this.sacgoat = this.sacgoat || ship.sacgoat
                this.personuid = this.personuid || ship.personuid
            }

//            _.debug("normal " + (this.barrels ? this.barrels.length : null) + " + " + this.shipoutcount)

            if (this.barrels) { this.setdirty() }

            ship.unloadcargo(function (barrel) {
                if (ship.retour && !barrel.progress) {
                    throw "error"
                    //if (!me.barrels) { me.barrels = [] }
                    //me.barrels.shift(barrel)

                    //_.debug("shift", me.barrels.length)

                    //me.setdirty()
                } else {
                    var pipe = me.pipe(barrel.pipeid)

                    if (!pipe) {
                        //return error??
                    } else {
                        //push barrel into pipe

                        //pipe
                        //    .onrequest(function () {
                        //    })

                        pipe.receive(barrel)
                    }
                }
            })

            //intialize ship to return
            if (!ship.retour) {
                ship.retour = true
                this.ships.push(ship)
            } else {
                ship.destroy()
            }
        }

        , doaction: function (action, params) {
            if (!this.shell) {
                this.loadshell(this.harbor.globals, this.harbor.actions)
            }

            //auth check
            return this.shell.doaction.call(this.shell, action, params)
        }

        , setdirty: function () {
            if (this.dirty) { return this }

//            _.debug("Dirty true " + this.name)

            this.dirty = true
            this.harbor.setdirty()
            return this
        }

        , sendbarrel: function (barrel) {
            //_.debug("sendbarrel " + (this.barrels ? this.barrels.length : null) + " + " + this.shipoutcount)

            if (!this.barrels) {
                this.barrels = []
                //_.debug("setdirty", this.dirty, this.harbor.dirty)
                this.setdirty()
            }

            this.barrels.push(barrel)
        }

        , ondestroy: function () {
            if (_.docklogger) {
                var personuid = this.personuid
                _.docklogger.writeline("destroy: " + _.make.date().value(this.lastactivity).format$("yyyy-mm-dd hh:nn:ss:iii") + " - " + this.harbor.name + " - " + this.name + " - " + personuid)
            }

            delete this.harbor.docks[this.name]
            this.harbor = null

            this.shell = null

            _.foreach(this.barrels, function (barrel) {
                barrel.destroy()
            })

            _.foreach(this.pipes, function (pipe) {
                pipe.destroy()
            })

            this.ships.foreach(function (ship) {
                ship.destroy()
            })
            
            
        }

        , onarrive: _.signal()

        , onchangeglobal_shell: _.signal(function (changeevent) {
            throw "global changed. Need to implement mutation event"
        })

        , onconnect: _.signal()

        , ondisconnect: _.signal()
    }
})
