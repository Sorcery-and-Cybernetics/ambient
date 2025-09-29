_.define.kindex("harbor", function (supermodel) {
    return {
        _dock: null

        , makebehavior: _.behavior({
            create: function (parent) {
                if (parent instanceof _.kind.world) {
                    parent = parent.land
                }

                if (!(parent instanceof _.kind.land)) {
                    throw "error: land expected"
                }

                this._dock = {}

                supermodel.create.apply(this, argument)
                this.land(addhabor(this))
            }
        })

        , authbehavior: _.behavior({
            _username: ""
            , _password: ""

            , setgate: function (username, password) {
                this._username = username
                this._password = password
                return this
            }

            , username: function () {
                return this._username
            }

            , password: function () {
                return this._password
            }
        })

        , fleetbehavior: _.behavior({
            arrive: function (fleet) {
                var dock = this.dock(fleet.dockid)

                if (dock) {
                    dock.arrive(fleet)
                } else {
                    fleet.error("no dock found")
                }
            }

            , depart: function (ship) {
                //refactormarker:
            }
        })

        , dockbehavior: _.behavior({
            dock: function (key) {
                var dock = this._dock[key]

                if (!dock && key) {
                    this.adddock(key)
                }

                return dock
            }

            , adddock: function (key, dock) {
                var def = _.make.dock()
                if (!def) { throw "error" }

                if (!dock) {
                    dock = def(this, key)
                }

                if (!(dock instanceof _.kind.dock)) {
                    throw "error: dock expected"
                }

                this._dock[key] = dock
                return dock
            }

            , removedock: function (dock) {
                if (dock.exists()) {
                    return dock.destroy()
                }

                delete this.dock[dock.key()]
            }
        })
    }
})