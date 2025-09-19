//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("linkedlistnode", function (_) {
    _.define.object("linkedlistnode", function (supermodel) {
        this._nextnode = null
        this._prevnode = null

        this._list = null
        this._value = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(value) {
                this._value = value
            }

            this.assign = function(cursor, index) {
                if (!cursor) { throw "Error: linkedlistnode.insertmebefore. Cursor is null"; }
                if (cursor == this) { return this }
                if (this._list) { this.unlink() }

                var list = (cursor instanceof _.model.linkedlistroot ? cursor : cursor._list)

                if (Math.abs(index) <= list.count()) { 
                    if (index < 0) {
                        while (index < -1) {
                            cursor = cursor._prevnode
                            index += 1
                        }

                    } else {
                        while (index > 0) {
                            cursor = cursor._nextnode
                            index -= 1
                        }
                    }
                } 

                // while (index) {
                //     if (index < -1) {
                //         cursor = cursor._prevnode
                //         if (cursor == list) { break }
                //         index += 1

                //     } else {
                //         cursor = cursor._nextnode
                //         if (cursor._nextnode == list) { break }
                //         index -= 1
                //     }
                // }

                this._list = list
                list._count += 1

                this._nextnode = cursor
                this._prevnode = cursor._prevnode

                this._prevnode._nextnode = this
                this._nextnode._prevnode = this

                return this
            }

            this.unlink = function() {
                if (this.list()) {
                    this._list._count -= 1
                }

                if (this._nextnode) { this._nextnode._prevnode = this._prevnode }
                if (this._prevnode) { this._prevnode._nextnode = this._nextnode }

                this._list = null
                this._nextnode = null
                this._prevnode = null
            }

            this.destroy = function () {
                if (this._list) { this.unlink() }
                return null
            }
        });

        this.modelbehavior = _.behavior(function() {
            this.parent = function () {
                return this._list._parent
            }

            this.list = function () {
                return this._list
            }

            this.isroot = function() { return false }

            this.value = function(value) {
                if (value === undefined) { return this._value }

                if (this._value != value) {
                    this._value = value
                }
                return this
            }
        });

        this.navigationbehavior = _.behavior(function() {
            this.nextnode = function () {
                return !this._nextnode || (this._nextnode == this._list ? null : this._nextnode)
            }

            this.prevnode = function () {
                return !this._prevnode || (this._prevnode == this._list ? null : this._prevnode)
            }
        })
    })

})