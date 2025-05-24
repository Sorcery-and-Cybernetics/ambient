//*************************************************************************************************
// signal - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("signal", function (_) {
    _.define.defextender("signal", function(supermodel) {
        // this.fndefault = undefined;

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