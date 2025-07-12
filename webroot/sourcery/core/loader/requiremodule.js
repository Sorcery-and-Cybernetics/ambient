//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("requiremodule", function(_) {
    _.define.object("requiremodule", function(supermodel) {
        this._parent = null
        this._loader = null
        this._name = ""
        this._rule = ""
        this._isloaded = false
        this._source = ""

        this.construct = function(parent, name, rule) {
            this._parent = parent._loader? parent: null
            this._loader = parent._loader? parent._loader: parent
            this._name = name
            this._rule = rule

            if (this._parent) { this._parent._modules.push(this) }
        }

        this.parent = function() { return this._parent }
        this.loader = function() { return this._loader }
        this.isrootmodule = function() { return false }
        this.isrequiremodule = function() { return true }
        this.rule = function() { return this._rule }
        this.name = function() { return this._name }

        this.load = function(god) {
            if (god.isloaded(this.name())) { return true }
            god.require(this.name())
            
            return false
        }
    })
})
