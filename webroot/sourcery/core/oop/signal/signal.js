//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("signal", function (_) {
    _.define.defextender("signal", function(supermodel) {
        // this.fndefault = null;

        this.construct = function(fndefault) {
            // if (fndefault) { this.fndefault = fndefault }
        };

        this.definetrait = function (modeldef, traitname) {
            return function (event) {
                if (_.isfunction(event)) {
                    var signaldata = this._signaldata || (this._signaldata = _.model.signaldata(this, this.fndefault));
                    signaldata.addsignal(traitname, event);
                } else {
                    if (this._signaldata) { this._signaldata.firesignal(traitname, event); }
                }
                return this;
            };
        };
    })
})