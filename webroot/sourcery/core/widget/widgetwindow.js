//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("widgetwindow", function(_) {
    _.define.model("widgetwindow", function (supermodel) {
        this.domdocument = null

        _.constructbehavior = _.behavior(function() {
            this.construct = function() {
                supermodel.create.call(this)
            }

            this.destroy = function() {
                this.disconnect()
                supermodel.destroy.call(this)
            }
        })

        this.connect = function(domdocument) {
            this.domdocument = domdocument
            return this
        }

        this.disconnect = function() {
            this.domdocument = null
            return this
        }
    })
})