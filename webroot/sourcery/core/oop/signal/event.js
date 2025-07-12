//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("event", function (_) {
    _.define.object("event", function () {
        this._name = ""
        this._source = null
        this._cancelled = false

        this.construct = function (source, name) {
            this._source = source
            this._name = name
        }

        this.name = function () {
            return this._name
        }

        this.source = function () {
            return this._source
        }

        this.cancelled = function () {
            return this._cancelled
        }

        this.cancel = function () {
            this._cancelled = true
        }

        //todo: figure out the best syntax for events.
        // this.raise = function () {
        //     var eventname = "on" + this._name
        //     var target = this._source

        //     if (target && target[eventname]) {
        //         target[eventname](this)
        //     }
        //     return this
        // }        
    })
})
