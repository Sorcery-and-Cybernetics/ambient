_.ambient.module("harbor", function(_) {
    _.define.object("harbor", function(supermodel) {
        this.name = ""
        this.ocean = null
        this.docks = null
        this.dirty = false

        this.construct = function(name) {
            this.name = name
            this.ocean = _.ocean
            this.ocean.registerharbor(this)
            this.docks = {}
        }

        this.send = function(barrels) {
            var ship = _.make.ship(this.name, this.name)
            ship.loadcargo(barrels)
            this.ocean.sail(ship)
        }

        this.arrive = function(ship) {
            this.onarrive(ship)
        }

        this.dock = function(id) {
            return this.docks[id]
        }

        this.adddock = function(dock) {
            this.docks[dock.id] = dock
        }

        this.foreachdock = function(next) {
            _.foreach(this.docks, next)
        }

        this.flush = function() {
            if (!this.dirty) { return }
            this.dirty = false
            this.foreachdock(function(dock) {
                if (dock.dirty) { dock.sendship() }
            })
        }

        this.onarrive = _.signal()
    })
})