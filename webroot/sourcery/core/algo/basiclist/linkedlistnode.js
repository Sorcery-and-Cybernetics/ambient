//*************************************************************************************************
// linkedlistnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
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

            this.assign = function(target, index) {
                if (target == this) { throw "Error: linkedlistnode.assign: Invalid target. Cannot point to itself" }
                if (this._list) { this.unlink() }

                var list = (target instanceof _.model.linkedlist || target == null) ? target || this._list : target._list
                if (!list) { throw "Error: linkedlistnode.assign: List is null" }

                // If target is null, treat as root
                if (target == null) { target = list }

                // Find to absolute target
                if (index < 0) {
                    while (index < -1) {
                        target = target.prevnode()
                        index += 1
                        if (!target || (target === list)) { break }
                    }
                } else {
                    while (index > 0) {
                        target = target.nextnode()
                        index -= 1
                        if (!target || (target === list)) { break }
                    }
                }

                if (!target) { target = list }

                this._list = list
                list._count += 1

                // Insert logic for first/lastnode pointers
                if (target === list) {
                    if (!list._firstnode) {
                        this._nextnode = null
                        this._prevnode = null
                        list._firstnode = this
                        list._lastnode = this
                    } else {
                        this._nextnode = null
                        this._prevnode = list._lastnode
                        list._lastnode._nextnode = this
                        list._lastnode = this
                    }
                } else {
                    // Insert before target
                    this._nextnode = target
                    this._prevnode = target._prevnode
                    
                    if (target._prevnode) {
                        target._prevnode._nextnode = this
                    } else {
                        list._firstnode = this
                    }
                    target._prevnode = this
                }

                return this
            }

            this.unlink = function() {
                var list = this._list

                if (!list) { return this }

                list._count -= 1

                if (this._prevnode) { 
                    this._prevnode._nextnode = this._nextnode 
                } else { 
                    list._firstnode = this._nextnode 
                }

                if (this._nextnode) { 
                    this._nextnode._prevnode = this._prevnode
                } else {
                    list._lastnode = this._prevnode 
                }

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

                if (value != value) {
                    this._value = value
                }
                return this
            }
        });

        this.navigationbehavior = _.behavior(function() {
            this.nextnode = function () {
                return this._nextnode || null
            }

            this.prevnode = function () {
                return this._prevnode || null
            }
        })
    })

})
