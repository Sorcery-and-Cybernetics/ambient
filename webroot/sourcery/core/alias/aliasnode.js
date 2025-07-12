//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("aliasnode", function(_) {    
    _.define.object("alias.node", function (supermodel) {
        this._object = null
        this._links = null

        this.construct = function(object) {
            this._object = object
        }

        this.load = function(data) {
            this.clear()
            this.values = data
        }

        this.getvalue = function(name) {
            return this._object? this._object.get(name) : null
        }

        this.clear = function() {
            if (this._links) {
                _.foreach(this._links, function(link) {
                    link.destroy()
                })
                this._links = null
            }
        } 
        
        this.destroy = function() {
            this.clear()
            supermodel.destroy.call(this)
        }        
    })
})














