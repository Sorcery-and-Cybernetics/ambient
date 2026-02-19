//**************************************************************************************************
// Ambient - Copyright (c) 1994-2026 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("uievent", function(_) {
    _.define.event("uievent", function() {
        this.eventtype = ""
        this.behaviortype = _.efb.none
        this.cancelbubble = false

        this.keycode = 0
        this.key = ""
        this.ctrlkey = false
        this.altkey = false
        this.shiftkey = false
        this.button = 0

        this.mouse = null
        this.wheel = null
        this.history = null
        this.target = null
        this.targetuid = 0
    })
})
