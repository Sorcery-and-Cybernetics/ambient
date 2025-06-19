//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("skiplistcursor", function (_) {
    
    _.define.object("skiplistcursor", function (supermodel) {
        this._list = undefined
        this._current = undefined

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
