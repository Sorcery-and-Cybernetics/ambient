//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("treebaselist", function (_) {
    _.define.object("treebaselist", function () {
        this._rootnode = null

        this.count = function() {
            return this._rootnode ? this._rootnode._count : 0
        }

        //todo: if item is in another list, remove from other list first.
        this.makenode = function (item) {
            if (item._indexof) { throw "error" }
            var node = _.model.treelistnode(this, item)

            return node
        }

        this.nodesortvalue = function(node) {
            return node.value()
        }

        this.push = function (item) { }

        this.insertnodebefore = function (cursor, node) {
            if (!node) { throw "error" }

            if (!cursor) {
                cursor = this.lastnode()

                if (cursor) {
                    return this.insertnodeafter(cursor, node)
                } else {
                    this._rootnode = node
                    node.updatecount(1)
                }

            } else {

                if (!cursor._leftnode) {
                    cursor._leftnode = node
                    node._topnode = cursor
                } else {
                    cursor = cursor._leftnode
                    while (cursor._rightnode) {
                        cursor = cursor._rightnode
                    }
                    cursor._rightnode = node
                    node._topnode = cursor
                }
                node.updatecount(1)
                node.balance()
            }
        }

        this.insertnodeafter = function (cursor, node) {
            if (!node) { throw "error" }

            if (!cursor) {
                cursor = this.firstnode()

                if (cursor) {
                    return this.insertnodebefore(cursor, node)
                } else {
                    this._rootnode = node
                    node.updatecount(1)
                }

            } else {

                if (!cursor._rightnode) {
                    cursor._rightnode = node
                    node._topnode = cursor
                } else {
                    cursor = cursor.next()

                    cursor._leftnode = node
                    node._topnode = cursor
                }
                node.updatecount(1)

                node.balance()
            }
        }

        this.remove = function (node) {
            node.destroy()
        }

        this._compare = function (itemvalue, search, findlike) {
            if (itemvalue == null) { return -1 }

            itemvalue = _.lcase$(itemvalue)
            search = _.lcase$(search)
            
            if (findlike) {
                return _.comparelike$(itemvalue, search)
            } else {
                return _.compare$(itemvalue, search)
            }
        }

        this._getcomparefn = function (findlike, matchcase) {
            if (findlike) {
                return _.comparelike$
            } else {
                return _.compare$
            }
        }

        this.getbypos = function (position) {
            var current = this._rootnode

            while (current) {
                var currentpos = current.position()

                switch (_.compare$(currentpos, position)) {
                    case -1:
                        current = current._rightnode
                        break

                    case 1:
                        current = current._leftnode
                        break

                    default:
                        return current
                }
            }
            return null
        }

        this.firstitem = function(){
            var cursor = this.firstnode()

            return cursor? cursor.item(): null
        }

        this.lastitem = function () {
            var cursor = this.lastnode()

            return cursor ? cursor.item() : null
        }

        this.firstnode = function () {
            var cursor = this._rootnode

            while (cursor && cursor._leftnode) {
                cursor = cursor._leftnode
            }
            return cursor
        }

        this.lastnode = function () {
            var cursor = this._rootnode

            while (cursor && cursor._rightnode) {
                cursor = cursor._rightnode
            }
            return cursor
        }

        this.foreachitem = function (next) {
            var cursor = this.firstnode()

            while (cursor) {
                next(cursor.item())
                cursor = cursor.next()
            }
        }

        // this.rebond = function (node) {
        //     if (node) {
        //         var item = node.item()
        //         node.destroy()
        //         this.push(item)
        //     }
        // }

        this.debugbehavior = _.behavior(function() {

            this.debugdump = function () {
                _.debug("")
                _.debug("Treelist debugdump")

                var cursor = this.firstnode()

                while (cursor) {
                    cursor.debugdump()
                    cursor = cursor.next()
                }
            }

            this.debugvalidate = function () {
                var node = this._rootnode
    //            if (!node) { return }
                if (node._topnode) { return "No topnode" }

                function testnode(node, parentnode) {
                    var count = 1
                    var result = ""

                    var leftnode = node._leftnode

                    if (leftnode) {
                        if (leftnode._topnode != node) { return "Left node not connected correctly to topnode" }
                        count += leftnode._count
                    }

                    var rightnode = node._rightnode

                    if (rightnode) {
                        if (rightnode._topnode != node) { return "Right node not connected correctly to topnode" }
                        count += rightnode._count
                    }

                    if (node._count != count) { return "Count does not match" }

                    if (!result && leftnode) { result = testnode(leftnode, node) }
                    if (!result && rightnode) { result = testnode(rightnode, node) }
                    return result || true
                }

                return testnode(node)
            }
        })
        
    })
})
