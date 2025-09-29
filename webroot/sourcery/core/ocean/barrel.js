//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("barrel", function(_) {

    _.define.object("barrel", function(supermodel) {
        this.id = 0
        this.pipeid = 0
        this.direction = 1      // 1 = forward/send, -1 = backward/reply
        this.data = null        // payload (object, string, or stream reference)
        this.progress = 0       // 0–100 or stream chunk index
        this.error = ""         // error string, empty if no error

        this.action = null      // action name (only set for the first barrel in a pipe)
        this.param = null       // action parameters (only set for the first barrel in a pipe)

        this.construct = function(data, progress) {
            if (data) { this.data = data }
            if (progress) { this.progress = progress }
        }

        this.assignto = function(pipeid, id) {
            this.pipeid = pipeid || 0
            this.id = id || 0

            return this
        }

        this.json = function(value) {
            if (!value) {
                var result = { id: this.id, pipeid: this.pipeid }

                if (this.direction !== 1) { result.direction = this.direction }
                if (this.data != null) { result.data = this.data }
                if (this.progress) { result.progress = this.progress }
                if (this.error) { result.error = this.error }

                return result
            }

            if (value.id) { this.id = value.id }
            if (value.pipeid) { this.pipeid = value.pipeid }
            if (value.direction) { this.direction = value.direction }
            if (value.data) { this.data = value.data }
            if (value.progress) { this.progress = value.progress }
            if (value.error) { this.error = value.error }

            return this
        }

        this.iserror = function() { return !!this.error }
        this.isclose = function() { return (this.progress == 100) || this.iserror() }
    })

})