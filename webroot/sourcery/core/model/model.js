//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("model", function(_) {
    _.define.object("model", function (supermodel) {
        this._self = undefined
        this.uid = _.model.property()

        this.construct = function() {
            _.modelagent.registermodel(this)
        }        

        this.self = function () {
            if (this.hasself()) { return this._self._self }
            return undefined
        }
        
        this.hasself = function() { return this._self? true: false }
    })
})