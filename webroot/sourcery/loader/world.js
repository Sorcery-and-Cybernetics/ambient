//****************************************************************************************************************************
// Ambient - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("world", function(_) {
    _.define.object("world", function() {
        this.system = undefined
        this.name = undefined
        this._modules = undefined

        this.construct = function(system, name) {
            this.system = system
            this.name = name
            this._modules = []
        }

        this.create = function() {
            this.load()
            return this
        }

        this.load = function() {
            var me = this

            _.foreach(this._modules, function(module) {
                if (module._onload) { module._onload(me) }
            })

            return this
        }
    })
})
