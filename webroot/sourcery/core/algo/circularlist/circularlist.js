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

            this.add = function(node, index) {
                if (!node) { throw "Error: circularlist.add. Node is null" }
                if (!(node instanceof _.model.circularlistnode)) { throw "Error: circularlist.add. Node is not a circularlistnode" }

                if (index === undefined) { index = -1 }  // default: add at tail

                if (!this._firstnode) {
                    // Insert as first
                    this._firstnode = node

                    node.unlink()

                    node._list = this
                    this._count = 1

                } else if (index < 0) {
                    // insert at tail
                    var tail = this._firstnode._prevnode || this._firstnode
                    node.assignafter(tail)

                } else {
                    // insert at head
                    node.assignbefore(this._firstnode)
                    this._firstnode = node
                }

                return node
            }            
        })

        this.foreach = function(callback) {
            if (!this._firstnode || !callback) { return this }

            var cursor = this._firstnode
            
            while (cursor) {
                var nextnode = cursor.nextnode()
                if (callback(cursor) === _.done) { break }
                cursor = nextnode
            }
            
            return this
        }        

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

