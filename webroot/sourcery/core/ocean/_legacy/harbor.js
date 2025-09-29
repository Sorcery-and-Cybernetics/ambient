_.define.aliaskind("harbor", function (supermodel) {
    return {
        docks: null
        , name: ""
        , ocean: null

        , routes: null
        , dirty: false

        , harbormaster: null

        , globals: null
        , actions: null


        , create: function (ocean, name, globals, actions) {
            supermodel.create.apply(this, arguments)

            this.ocean = ocean
            this.name = name

            this.globals = globals || {}
            this.actions = actions || {}

            //this.routes = {}
            this.docks = {}
        }

        , dock: function (id) {
            return this.docks[id]
        }

        , fordock: function (next) {
            _.foreach(this.docks, next)
        }

        , finddockbysession: function (sessiontoken) {
            if (!sessiontoken) {
                return
            }
            var result = null
            _.foreach(this.docks, function (dock) {
                if (dock.sessiontoken == sessiontoken) {
                    result = dock
                    return _.done
                }
            })
            return result
        }

        , arrive: function (ship) {
            if (ship.retour) {
                var dock = this.dock(ship.destination)
                dock.arrive(ship)

                return true
            }

            //todo: if session is closed, it cannot just reopen for business.
            var dock = this.harbormaster.finddock(ship)

            if (!dock) {
                ship.error("no dock found")
                return false
            }

            dock.arrive(ship)
            return true
        }

        , setdirty: function () {
            if (this.dirty) { return this }

            this.dirty = true
            this.ocean.setdirty()
            return this
        }

        , ondestroy: function () {
            this.ocean.harbors[name] = undefined
            this.ocean = null
        }

        , onarrive: _.signal()
    }
})
