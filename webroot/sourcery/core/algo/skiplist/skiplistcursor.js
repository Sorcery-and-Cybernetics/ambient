//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("skiplistcursor", function (_) {
    
    _.define.object("skiplistcursor", function (supermodel) {
        this._list = null
        this._current = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(list) {
                this._list = list
            }
        })

        this.navigationbehavior = _.behavior(function() {
            this.eof = function() { 
                return !(this._current && !this._current._isroot)
            };
        });
    });
});
