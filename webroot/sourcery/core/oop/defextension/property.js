//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("property", function (_) {
    var makeproperty = function (def, modeldef) {
        var traitname = "_" + def._name
        modeldef[traitname] = def._initial

        return function (value) {            
            var me = this

            if (value === undefined) {
                value = me[traitname]

                if (value == null) {
                    var self = this.self()
                    if (self) { value = self[traitname] }
                } 

                if (def._onget) {
                    return def._onget.call(me, value)
                }
                return value
            }

            var oldvalue = me[traitname]

            if (oldvalue !== value) {
                if (def._onset) {
                    var result = def._onset.call(me, value, oldvalue)

                    if (result !== undefined) { value = result }
                }
                
                me[traitname] = value

                if (def._onchange) {
                    def._onchange.call(me, value, oldvalue)                
                }
            }

            return me
        }
    }

    _.define.defextender("property", function(supermodel) {
        this._initial = null

        this.construct = function(initial) {
            this._initial = initial
        }

        this.definetrait = function (modeldef, traitname) {
            this._name = traitname

            var result = makeproperty(this, modeldef)
            result.definition = this

            return result            
        }

        this.onget = function (fn) {
            this._onget = fn
            return this
        }

        this.onset = function (fn) {
            this._onset = fn
            return this
        }

        this.onchange = function (fn) {
            this._onchange = fn
            return this
        }        
    })
})