//*****************************************************************************************************************
// event - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

_.ambient.module("event", function (_) {
    _.define.object("event", function () {
        this._name = ""
        this._source = undefined
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
