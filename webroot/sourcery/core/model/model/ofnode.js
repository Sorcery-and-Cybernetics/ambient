//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("ofnode", function(_) {
    _.define.object("ofnode", function (supermodel) {
        this._of = null
        this._self = null

        this.construct = function (of, self) {
            this._of = as
            this._self = self
        }

        this.of = function () {
            return this._of
        }

        this.self = function () {
            return this._self
        }

        this.value = function () {
            return this._self.value()
        }
    })
})