//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("ship", function(_) {
    _.define.object("ship", function(supermodel) {
        this.home = ""
        this.destination = ""
        this.retour = false
        this.cargo = null
        this.err = null

        this.sessiontoken = null
        this.username = null
        this.userpass = null
        this.sacgoat = ""        

        this.location = null

        this.construct = function(home, destination) {
            this.home = home
            this.destination = destination
            this.cargo = []
        }

        this.assignto = function(location) {
            this.location = location
        }

        this.loadcargo = function(barrels) {
            this.cargo = barrels
            return this
        }

        this.forcargo = function(next) {
            if (this.cargo) {
                for (var index = 1; index <= this.cargo.length; index++) {
                    next(this.cargo[index])
                }
            }
            return this
        }

        this.hascargo = function() {
            return !!(this.cargo && this.cargo.length)
        }

        this.json = function (data) {
            if (!data) {
                var cargodata = []

                _.foreach(this.cargo, function (barrel) {
                    cargodata.push(barrel.json())
                })

                var result = {
                    home: this.home
                    , destination: this.destination
                    , retour: this.retour
                    , dockid: this.dockid
                    , cargo: cargodata
                }

                if (this.err) { result.err = this.err }

                if (this.sessiontoken) {
                    result.sessiontoken = this.sessiontoken
                } else if (this.sacgoat) {
                    result.sacgoat = this.sacgoat
                } else {
                    result.username = this.username
                    result.userpass = this.userpass
                }
                return result
            }

            var me = this

            me.home = data.home
            me.retour = data.retour
            me.destination = data.destination
            me.dockid = data.dockid || null
            me.err = data.err || null

            me.sessiontoken = data.sessiontoken || null
            me.sacgoat = data.sacgoat || null
            me.username = data.username || null
            me.userpass = data.userpass || null

            me.cargo = []

            _.foreach(data.cargo, function (barreldata) {
                var barrel = _.make.barrel()
                    .json(barreldata)

                me.cargo.push(barrel)
            })

            return this
        }

        this.sail = function() {
            _.ocean.sail(this)
        }

        this.error = function(message) {
            if (this.retour) { throw "ship.error called during retour" }
            this.err = message
            this.retour = true
            this.sail()
        }

        this.ondestroy = function() {
            this.cargo = null
        }
    })
})