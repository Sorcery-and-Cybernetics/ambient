//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("model", function(_) {
    _.define.object("model", function (supermodel) {
        this._self = null
        this.uid = _.model.property()

        this.assign = function(parent, name, orderindex) {
            if (name) { this._name = name }
            _.modelagent.registermodel(parent, this, orderindex)
        }        

        this.self = function () {
            if (this.hasself()) { return this._self._self }
            return null
        }

        this.selfnode = function() {
            if (this.hasself()) { return this._self }
            return null
        }
        
        this.hasself = function() { return this._self? true: false }
    })
})