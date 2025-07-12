//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("selfnode", function(_) {
    _.define.object("selfnode", function (supermodel) {
        this._as = null
        this._self = null

        this.construct = function (as, self) {
            this._as = as
            this._self = self
        }

        this.as = function () {
            return this._as
        }

        this.self = function () {
            return this._self
        }

        this.value = function () {
            return this._self.value()
        }
    })
})