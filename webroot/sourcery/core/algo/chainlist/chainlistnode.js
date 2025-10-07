//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("chainlistnode", function(_) {
    _.define.object("chainlistnode", function (supermodel) {
        this._nextnode = null
        this._prevnode = null
        this._list = null
        this._value = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(value) {
                this._value = value
            }

            //The linkedlist is circular. We insert before the cursor.
            //When cursor is the list iteself, index 0 inserts at the end, index 1 inserts at head
            //When cursor is a node. 0 inserts before the cursor and 1 inserts after cursor
            this.assignto = function(cursor, index) {
                if (!cursor) { throw "Error: chainlistnode.insertmebefore - Cursor is null"; }
                if (cursor == this) { return this }
                if (this._list) { this.unlink() }

                var list
                var replacehead = false                

                if (cursor instanceof _.model.chainlist) {
                    list = cursor
                    cursor = list._firstnode

                    if (!cursor) {
                        this._list = list
                        this._nextnode = this
                        this._prevnode = this
                        list._firstnode = this
                        list._count = 1
                        
                        return this
                    }

                    if (index == 1) { replacehead = true }

                } else {
                    list = cursor._list
                    if (!list) { throw "Error: cursor not in a list" }

                    if (index == 1) {
                        cursor = cursor._nextnode
                    } else {
                        if (cursor == list._firstnode) { replacehead = true }   
                    }
                }         

                this._list = list
                list._count += 1

                this._nextnode = cursor
                this._prevnode = cursor._prevnode

                this._prevnode._nextnode = this
                this._nextnode._prevnode = this

                if (replacehead) { list._firstnode = this }

                return this
            }


            this.unlink = function() {
                var list = this._list
         
                if (list) { 
                    list._count -= 1

                    if (!list._count) {
                        list._firstnode = null

                    } else {
                        this._prevnode._nextnode = this._nextnode
                        this._nextnode._prevnode = this._prevnode
                        
                        if (list._firstnode == this) { list._firstnode = this._nextnode }
                    }
                }

                this._list = null
                this._nextnode = null
                this._prevnode = null 
                
                return this
            }

            this.destroy = function() {
                this.unlink()
                return null
            }
        })

        this.modelbehavior = _.behavior(function() {
            this.parent = function () { return this._list? this._list._parent: null }            
            this.list = function() { return this._list }
            this.isfirst = function() { return this._list && this._list._firstnode == this }
            this.islast = function() { return this._list && this._list._firstnode._prevnode == this }

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
                return this._list._cyclic || (!this.islast())? this._nextnode: null
            }

            this.prevnode = function() {
                return this._list._cyclic || (!this.isfirst())? this._prevnode: null
            }
        })
    })
})
