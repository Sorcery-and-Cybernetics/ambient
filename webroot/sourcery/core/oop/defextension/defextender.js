//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("defextender", function (_) {
    _.define.object("defextender", function(supermodel) {
        this.definetrait = function (modeldef, traitname) { }

        this.iscompatible = function (superdef) { return (this._modelname == superdef._modelname) } 

        this.inherit = function (superdef) {
            for (var traitname in superdef) {
                var traitvalue = this[traitname]

                if (!_.isfunction(traitvalue) && this.hasOwnProperty(traitname)) {
                    switch (traitname) {
                        case "_modelname":
                        case "_parent":
                        case "_definition":
                        case "_name":
                            break
                        default:
                            var supervalue = superdef[traitname]

                            if ((traitvalue === undefined) && (supervalue !== undefined)) {
                                this[traitname] = supervalue
                            }
                    }                    
                }
            }
        }
    })
})