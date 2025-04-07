//*************************************************************************************************
// basicsignal - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicsignal", function (_) {
    _.define.defextender("core.basicsignal", function(supermodel) {
        // this.fndefault = null;

        this.initialize = function(fndefault) {
            // if (fndefault) { this.fndefault = fndefault }
        };

        this.definetrait = function (modeldef, traitname) {
            return function (event) {
                if (_.isfunction(event)) {
                    var signaldata = this.__signaldata || (this.__signaldata = _.make.core.signaldata(this, this.fndefault));
                    signaldata.addbasicsignal(traitname, event);
                } else {
                    if (this.__signaldata) { this.__signaldata.firebasicsignal(traitname, event); }
                }
                return this;
            };
        };
    });
})