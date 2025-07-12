//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("clientconsole", function (_) {
    _.define.globalobject("console", function() {
        this.log = function (line, mode) {
            console.log(line)
        }

        this.clear = function() {
            if ((console == null) || !console.clear) { return }
            console.clear()
        }
    })
})