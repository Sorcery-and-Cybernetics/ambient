//*************************************************************************************************
// linkedlist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("linkedlist", function(_) {    
    _.define.object("linkedlist", function (supermodel) {
        this.__nodenext = null
        this.__nodeprev = null
        this.__count = 0

        this.objectbehavior = _.behavior(function() {
            this.construct = function() {
                this.__nodenext = this
                this.__nodeprev = this
            }

            this.destroy = function () {
                var cursor = this.__nodefirst

                while (cursor) {
                    var nodenext = cursor.nodenext()
                    cursor.destroy()
                    cursor = nodenext
                }
                return null
            }                
        })

        this.linkedlistbehavior = _.behavior(function () {
            this.count = function () { return this.__count }
            this.isroot = function () { return true }
            this.nodefirst = function () { return this.__nodenext.isroot()? null: this.__nodenext }
            this.nodelast = function () { return this.__nodeprev.isroot()? null: this.__nodeprev }

            this.__makenode = function(item) {
                if (item instanceof _.model.linkedlistnode) { return item } 
                return _.model.linkedlistnode(item)
            }
            
            this.foreach = function(fn) {
                var nodes = []
                var cursor = this.nodefirst()
                var context = null
                
                while (cursor) {
                    nodes.push(cursor)
                    cursor = cursor.nodenext()
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
                var cursor = this.nodefirst()
                var count = 0

                while (cursor && cursor != this) {
                    count += 1

                    if (cursor.list() != this) { errors.push("Node not in list") }

                    if (!cursor.nodeprev()) {
                        if (this.nodefirst() != cursor) { errors.push("nodefirst not pointing to this node") }                             
                    } else if (!cursor.nodeprev()){
                        errors.push("Missing nodeprev") 
                    } else {
                        if (cursor.nodeprev().nodenext() != cursor) { errors.push("nodeprev not pointing to this node") }
                    }

                    if (!cursor.nodenext()) {
                        if (this.nodelast() != cursor) { errors.push("nodelast not pointing to this node") }                             
                    } else if (!cursor.nodenext()) {
                        errors.push("Missing nodenext")
                    } else {
                        if (cursor.nodenext().nodeprev() != cursor) { errors.push("nodenext not pointing to this node") }
                    }

                    cursor = cursor.nodenext()
                }

                if (count != this.count()) { errors.push("Count mismatch") }
//                    if (cursor != this) { errors.push("This list is not a full circle") }

                if (errors.length > 0) { return _.debug("List validation errors: ", errors) }
                return undefined
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