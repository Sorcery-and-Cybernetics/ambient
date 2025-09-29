//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("ocean", function(_) {
    _.define.object("ocean", function(supermodel) {
        this.world = null
        this.harbor = null
        this._dirty = false

        this._dirtytimer = 0
        this._statetimer = 0
        this._disconnected = true
        this._docktimeout = 1000 * 15 * 60

        this.create = function(world) {
            this.world = world
            this.harbor = _.model.map()
            this.updatestate()
        }

        this.registerharbor = function(harborname) {
            //Todo: find config
            var harbor = _.model.harbor(harborname)
            // harbor.initialize(config)

            this.harbor.set(harborname, harbor)
            return harbor
        }

        this.findharbor = function(name) {
            return this.harbor.get(name)
        }

        this.foreachharbor = function(next) {
            this.harbor.foreach(next)
        }

        this.sail = function(ship) {
            var harbor = this.findharbor(ship.destination)            
            if (!harbor) { return ship.error("unknown harbor") }
            
            this.onarrive(ship)
            harbor.arrive(ship)
        }

        this.setdirty = function() {
            if (this._dirty) { return }
            var me = this

            this._dirtytimer = _.timer.waitfor(1, "ocean.setdirty")
                .ontimer(function() {
                    me._dirty = false
                    me.foreachharbor(function(harbor) {
                        harbor.sendship()
                    })
                    if (me._dirty) { this.waitfor(10) }
                })

            this._dirty = true
        }

        this.updatestate = function() {
            var me = this

            this._statetimer = _.timer.waitfor(60000, "ocean.updatestate")
                .ontimer(function() {
                    var now = _.timer.now
                    me.foreachharbor(function(harbor) {
                        harbor.foreachdock(function(dock) {
                            if (!dock.isdeparturedock) {
                                if (dock.lastactivity + me._docktimeout < now) {
                                    dock.destroy()
                                }
                            }
                        })
                    })
                    this.waitfor(60000)
                })
        }

        this.destroy = function() {

        }

        this.onarrive = _.model.signal()
        this.ondepart = _.model.signal()

        this.onconnect = _.model.signal()
        this.ondisconnect = _.model.signal()
    })
})
