//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("uidocument", function(_) {
    _.define.object("uidocument", function(supermodel) {
        this.attach = function(widgetwindow, uidocument) {}
        this.detach = function() { }

        this.onuievent = _.model.basicsignal()
        this.onresize = _.model.basicsignal()
        this.onunload = _.model.basicsignal()
        this.onbeforeunload = _.model.basicsignal()
        this.onvisibilitychange = _.model.basicsignal()        
    })
})
