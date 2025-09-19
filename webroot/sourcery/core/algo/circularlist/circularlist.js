//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("circularlist", function(_) {
    _.define.object("circularlist", function (supermodel) {
        this._firstnode = null
        this._count = 0

        this.constructbehavior = _.behavior(function() {
            this.count = function() { return this._count }
            this.first = function() { return this._firstnode }
            this.last = function() { return this._firstnode? this._firstnode._prevnode: null }
        })

        this.debugbehavior = _.behavior(function() {
            this.debugout = function() {
                var result = []
                var cursor = this.firstnode()

                while (cursor) {
                    result.push(cursor.value())
                    cursor = cursor.nextnode()
                }
                return result
            }
        })
    })
})

