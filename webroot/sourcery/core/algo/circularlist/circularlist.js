//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("circularlist", function(_) {
    _.define.object("circularlist", function (supermodel) {
        this._firstnode = null
        this._count = 0
        this._cyclic = false

        this.modelbehavior = _.behavior(function() {
            this.count = function() { return this._count }
            this.firstnode = function() { return this._firstnode }
            this.lastnode = function() { return this._firstnode? this._firstnode._prevnode: null }

            this.foreach = function(callback) {
                if (!this._firstnode || !callback) { return this }

                var cursor = this._firstnode

                while (cursor) {
                    if (callback(cursor) === _.done) { break }
                    cursor = cursor.islast()? null:cursor.nextnode()
                }

                return this
            }  
        })      

        this.debugbehavior = _.behavior(function() {
            this.debugvalidate = function() {
                var errors = []
                var count = 0

                var cursor = this.firstnode()

                while (cursor) {
                    count += 1

                    if (cursor.list() != this) { errors.push("node " + count + " not in list") }
                    if (!cursor._prevnode) { errors.push("node " + count + " has no prevnode") }
                    if (!cursor._nextnode) { errors.push("node " + count + " has no nextnode") }

                    if (cursor._nextnode._prevnode != cursor) { errors.push("node " + count + " nextnode does not point back to this node") }
                    if (cursor._prevnode._nextnode != cursor) { errors.push("node " + count + " prevnode does not point to the correct nextnode") }

                    cursor = cursor.islast()? null:cursor.nextnode()
                }

                if (count != this._count) { errors.push("list count mismatch (" + count + " vs " + this._count + ")") }
                return errors.length? errors: null
            }

            this.debugout = function() {
                var result = []

                this.foreach(function(node) {
                    result.push(node.value())
                })

                return result
            }
        })
    })
})

