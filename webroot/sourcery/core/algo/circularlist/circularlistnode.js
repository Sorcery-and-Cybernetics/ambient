//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("circularlistnode", function(_) {
    _.define.object("circularlistnode", function (supermodel) {
        this._nextnode = null
        this._prevnode = null
        this._list = null
        this._value = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(value) {
                this._value = value
            }

            this.assign = function(cursor, index) {
                if (!cursor || (cursor == this)) { throw "Error: Invalid cursor" }
                if (this._list || this._nextnode) { this.unlink() }

                var list = cursor._list

                if (list) {
                    this._list = list
                    list._count += 1

                    if (index < 0) {
                        if (list._firstnode == cursor) { list._firstnode = this }
                    }
                }

                if (index < 0) {
                    // link before cursor
                    this._prevnode = cursor._prevnode || null
                    this._nextnode = cursor

                    cursor._prevnode = this
                    if (this._prevnode) { this._prevnode._nextnode = this }
                } else {
                    this._nextnode = cursor._nextnode
                    this._prevnode = cursor    

                    cursor._nextnode = this
                    if (this._nextnode) { this._nextnode._prevnode = this }                    

                }

                return this            
            }

            this.unlink = function() {
                var list = this._list

                if (list) { 
                    list._count -= 1 
                    if (list._firstnode == this) { list._firstnode = this._nextnode || null }                    
                }

                if (this._nextnode) { this._nextnode._prevnode = this._prevnode }
                if (this._prevnode) { this._prevnode._nextnode = this._nextnode }

                this._list = null
                this._nextnode = null
                this._prevnode = null
            }

            this.destroy = function() {
                this.unlink()
                return null
            }
        })

        this.modelbehavior = _.behavior(function() {
            this.parent = function () { return this._list? this._list._parent: null }            
            this.list = function() { return this._list }

            this.isfirst = function() { 
                if (this._prevnode && !this._prevnode._nextnode) { return true }
                if (!this._prevnode) { return true }
                return false
            }

            this.islast = function() { 
                if (!this._nextnode) { return true }
                return false
            }

            this.value = function(value) {
                if (value === undefined) { return this._value }

                if (this._value != value) {
                    this._value = value
                }
                return this
            } 
            
        })

        this.navigationbehavior = _.behavior(function() {
            this.nextnode = function() {
                return this._nextnode
            }

            this.prevnode = function() {
                return this.isfirst()? null:this._prevnode
            }
        })
    })
})
