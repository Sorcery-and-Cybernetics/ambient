//*************************************************************************************************
// treebaselist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("treebaselist", function (_) {
    _.define.core.object("core.treebaselist", function () {
        return {
            _rootnode: null

            , count: function() {
                return this._rootnode ? this._rootnode._count: 0
            }

            //todo: if item is in another list, remove from other list first.
            , makenode: function (item) {
                if (item._indexof) { throw "error" }
                var node = _.make.core.treelistnode(this, item)

                return node
            }

            , nodesortvalue: function(node) {
                return node.value()
            }

            , push: function (item) { }

            , insertnodebefore: function (cursor, node) {
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

            , insertnodeafter: function (cursor, node) {
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

            , remove: function (node) {
                node.destroy()
            }

            , _compare: function (itemvalue, search, findlike) {
                if (itemvalue == null) { return -1 }

                itemvalue = _.lcase$(itemvalue)
                search = _.lcase$(search)
                
                if (findlike) {
                    return _.comparelike$(itemvalue, search)
                } else {
                    return _.compare$(itemvalue, search)
                }
            }

            , _getcomparefn: function (findlike, matchcase) {
                if (findlike) {
                    return _.comparelike$
                } else {
                    return _.compare$
                }
            }

            , getbypos: function (position) {
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

            , firstitem: function(){
                var cursor = this.firstnode()

                return cursor? cursor.item(): null
            }

            , lastitem: function () {
                var cursor = this.lastnode()

                return cursor ? cursor.item() : null
            }

            , firstnode: function () {
                var cursor = this._rootnode

                while (cursor && cursor._leftnode) {
                    cursor = cursor._leftnode
                }
                return cursor
            }

            , lastnode: function () {
                var cursor = this._rootnode

                while (cursor && cursor._rightnode) {
                    cursor = cursor._rightnode
                }
                return cursor
            }

            , foreachitem: function (next) {
                var cursor = this.firstnode()

                while (cursor) {
                    next(cursor.item())
                    cursor = cursor.next()
                }
            }

            // , rebond: function (node) {
            //     if (node) {
            //         var item = node.item()
            //         node.destroy()
            //         this.push(item)
            //     }
            // }

            , debugdump: function () {
                _.debug("")
                _.debug("Treelist debugdump")

                var cursor = this.firstnode()

                while (cursor) {
                    cursor.debugdump()
                    cursor = cursor.next()
                }
            }

            , debugvalidate: function () {
                var node = this._rootnode
    //            if (!node) { return }
                if (node._topnode) { throw "error" }

                function testnode(node, parentnode) {
                    var count = 1
                    var result = null

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
                    return result
                }

                return testnode(node)
            }
        }
    })
})
