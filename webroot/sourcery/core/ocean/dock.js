_.ambient.module("dock", function(_) {
    _.define.object("dock", function(supermodel) {
        this.id = ""
        this.harbor = null
        this.lastactivity = 0
        this.dirty = false
        this.isdeparturedock = false

        this.construct = function(harbor, id) {
            this.harbor = harbor
            this.id = id
            harbor.adddock(this)
        }

        this.arrive = function(ship) {
            this.lastactivity = _.timer.now
            this.onarrive(ship)
        }

        this.sendship = function() {
            // server-specific implementation to send reply ship
        }

        this.destroy = function() {
            delete this.harbor.docks[this.id]
        }

        this.onarrive = _.signal()
    })
})