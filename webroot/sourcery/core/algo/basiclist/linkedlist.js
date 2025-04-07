//*************************************************************************************************
// linkedlist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("linkedlist", function(_) {    
    _.define.core.object("core.linkedlist", function (supermodel) {
        return {
            __nextnode: null
            , __prevnode: null
            , __count: 0            
            
            , objectbehavior: _.behavior({
                initialize: function() {
                    this.__nextnode = this
                    this.__prevnode = this
                }

                , destroy: function () {
                    var cursor = this.__firstnode
    
                    while (cursor) {
                        var nextnode = cursor.nextnode()
                        cursor.destroy()
                        cursor = nextnode
                    }
                    return null
                }                  
            })

            , linkedlistbehavior: _.behavior({
                count: function () { return this.__count }
                , isroot: function () { return true }
                , firstnode: function () { return this.__nextnode.isroot()? null: this.__nextnode }
                , lastnode: function () { return this.__prevnode.isroot()? null: this.__prevnode }

                , __makenode: function(item) {
                    if (item instanceof _.make.core.linkedlistnode) { return item } 
                    return _.make.core.linkedlistnode(item)
                }
                
                , foreach: function(fn) {
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

            , debugbehavior: _.behavior({
                debugvalidate: function() {
                    var errors = []
                    var cursor = this.firstnode()
                    var count = 0

                    while (cursor && cursor != this) {
                        count += 1

                        if (cursor.list() != this) { errors.push("Node not in list") }

                        if (!cursor.prevnode()) {
                            if (this.firstnode() != cursor) { errors.push("Firstnode not pointing to this node") }                             
                        } else if (!cursor.prevnode()){
                            errors.push("Missing prevnode") 
                        } else {
                            if (cursor.prevnode().nextnode() != cursor) { errors.push("Prevnode not pointing to this node") }
                        }

                        if (!cursor.nextnode()) {
                            if (this.lastnode() != cursor) { errors.push("Lastnode not pointing to this node") }                             
                        } else if (!cursor.nextnode()) {
                            errors.push("Missing nextnode")
                        } else {
                            if (cursor.nextnode().prevnode() != cursor) { errors.push("Nextnode not pointing to this node") }
                        }

                        cursor = cursor.nextnode()
                    }

                    if (count != this.count()) { errors.push("Count mismatch") }
//                    if (cursor != this) { errors.push("This list is not a full circle") }

                    if (errors.length > 0) { return _.debug("List validation errors: ", errors) }
                    return undefined
                }

                , debugout: function () {
                    var result = []

                    this.foreach(function(node) {
                        result.push(node.value()) 
                    })
            
                    return result
                }
            })
            
            
        }
    })
})