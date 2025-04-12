//*************************************************************************************************
// signal - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("signal", function (_) {
    _.define.defextender("core.signal", function(supermodel) {
        // this.fndefault = null;

        this.construct = function(fndefault) {
            // if (fndefault) { this.fndefault = fndefault }
        };

        this.definetrait = function (modeldef, traitname) {
            return function (event) {
                if (_.isfunction(event)) {
                    var signaldata = this.__signaldata || (this.__signaldata = _.make.core.signaldata(this, this.fndefault));
                    signaldata.addsignal(traitname, event);
                } else {
                    if (this.__signaldata) { this.__signaldata.firesignal(traitname, event); }
                }
                return this;
            };
        };
    })
})