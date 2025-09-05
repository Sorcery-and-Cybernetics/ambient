//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("linkedlistroot", function(_) {
    _.define.object("linkedlistroot", function (supermodel) {
        this._nextnode = null
        this._prevnode = null
        this._count = 0

        this.objectbehavior = _.behavior(function() {
            this.construct = function() {
                this._nextnode = this
                this._prevnode = this
            }

            this.destroy = function () {
                var cursor = this._firstnode

                while (cursor) {
                    var nextnode = cursor.nextnode()
                    cursor.destroy()
                    cursor = nextnode
                }
                return null
            }
        })

        this.linkedlistbehavior = _.behavior(function () {
            this.count = function () { return this._count }
            this.isroot = function () { return true }
            this.firstnode = function () { return this._nextnode.isroot()? null: this._nextnode }
            this.lastnode = function () { return this._prevnode.isroot()? null: this._prevnode }

            this._makenode = function(item) {
                if (item instanceof _.model.linkedlistnode) { return item }
                return _.model.linkedlistnode(item)
            }

            this.foreach = function(fn) {
                var nodes = []
                var cursor = this.firstnode()
                var context = null

                while (cursor) {
                    nodes.push(cursor)
                    cursor = cursor.nextnode()
                }

                for (var index = 0; index < nodes.length; index++) {
                    cursor = nodes[index]

                    //todo: check if cursor is destroyed.

                    if (fn.call(context, cursor, index + 1) == _.done) { break }
                }
                return this
            }
        })

        this.debugbehavior = _.behavior(function() {
            this.debugvalidate = function() {
                var errors = []
                var cursor = this.firstnode()
                var count = 0

                while (cursor && cursor != this) {
                    count += 1

                    if (cursor.list() != this) { errors.push("Node not in list") }

                    if (!cursor.prevnode()) {
                        if (this.firstnode() != cursor) { errors.push("firstnode not pointing to this node") }                             
                    } else if (!cursor.prevnode()){
                        errors.push("Missing prevnode") 
                    } else {
                        if (cursor.prevnode().nextnode() != cursor) { errors.push("prevnode not pointing to this node") }
                    }

                    if (!cursor.nextnode()) {
                        if (this.lastnode() != cursor) { errors.push("lastnode not pointing to this node") }                             
                    } else if (!cursor.nextnode()) {
                        errors.push("Missing nextnode")
                    } else {
                        if (cursor.nextnode().prevnode() != cursor) { errors.push("nextnode not pointing to this node") }
                    }

                    cursor = cursor.nextnode()
                }

                if (count != this.count()) { errors.push("Count mismatch") }
//                    if (cursor != this) { errors.push("This list is not a full circle") }

                if (errors.length > 0) { return _.debug("List validation errors: ", errors) }
                return null
            }

            this.debugout = function () {
                var result = []

                this.foreach(function(node) {
                    result.push(node.value()) 
                })
        
                return result
            }
        })
    })
})