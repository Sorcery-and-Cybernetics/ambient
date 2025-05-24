//*************************************************************************************************
// basicsignal - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicsignal", function (_) {
    _.define.defextender("basicsignal", function(supermodel) {
        // this.fndefault = undefined;

        this.construct = function(fndefault) {
            // if (fndefault) { this.fndefault = fndefault }
        };

        this.definetrait = function (modeldef, traitname) {
            return function (event) {
                if (_.isfunction(event)) {
                    var signaldata = this._signaldata || (this._signaldata = _.model.signaldata(this, this.fndefault));
                    signaldata.addbasicsignal(traitname, event);
                } else {
                    if (this._signaldata) { this._signaldata.firebasicsignal(traitname, event); }
                }
                return this;
            };
        };
    });
})