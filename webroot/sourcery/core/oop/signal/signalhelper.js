//*************************************************************************************************
// signalhelper - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("signalhelper", function (_) {
    _.define.helper("signal", function() {
        
        this.addsignallist = function(object) {
            if (!object._signals) {
                object._signals = {}
            }
        }

        this.addbasicsignal = function (object, signalname, signal) {
            this.addsignallist(object)
            
            if (!object._signals[signalname]) {
                object._signals[signalname] = signal
            }            
        }

        this.firebasicsignal = function (object, signalname, event) {
            if (object._signals[signalname]) {
                object._signals[signalname].call(object, event)
            }
        }
    })
})
