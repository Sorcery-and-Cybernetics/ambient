//*************************************************************************************************
// signalhelper - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("signalhelper", function (_) {
    _.define.helper("core.signal", {
        addsignallist: function(object) {
            if (!object.__signals) {
                object.__signals = {}
            }
        }

        , addbasicsignal: function (object, signalname, signal) {
            this.addsignallist(object)
            
            if (!object.__signals[signalname]) {
                object.__signals[signalname] = signal
            }            
        }

        , firebasicsignal: function (object, signalname, event) {
            if (object.__signals[signalname]) {
                object.__signals[signalname].call(object, event)
            }
        }
    })
})
