//*************************************************************************************************
// signalhelper - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("signalhelper", function (_) {
    _.define.helper("core.signal", function() {
        
        this.addsignallist = function(object) {
            if (!object.__signals) {
                object.__signals = {}
            }
        }

        this.addbasicsignal = function (object, signalname, signal) {
            this.addsignallist(object)
            
            if (!object.__signals[signalname]) {
                object.__signals[signalname] = signal
            }            
        }

        this.firebasicsignal = function (object, signalname, event) {
            if (object.__signals[signalname]) {
                object.__signals[signalname].call(object, event)
            }
        }
    })
})
