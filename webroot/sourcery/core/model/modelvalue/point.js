//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("point", function(_) {
    _.define.modelvalue("point", function () {
        this.x = _.model.property(0)
        this.y = _.model.property(0)

        this.construct = function (x, y) {
            this.x(x || 0)
            this.y(y || 0)
        }
    })
})