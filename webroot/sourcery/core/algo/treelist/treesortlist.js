//*************************************************************************************************
// treesortlist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("treesortlist", function (_) {
    _.define.core.treebaselist("core.treesortlist", function () {
        return {
            _rootnode: null
    
//            , sortkey: _.property("key")
    
            , push: function (item) {
                var node = this.makenode(item)
                var value = this.nodesortvalue(item)
                var found = this.findlastnode(value, true)

                this.insertnodeafter(found, node)
                return this
            }
    
            , findfirstnode: function (search, findclosest) {
                var list = this
                //            var searchtoken = _.make.listsearchtoken(search)
    
                var cursor = list._rootnode
                var closest = cursor
                var found
    
                while (cursor) {
                    switch (list._compare(this.nodesortvalue(cursor), search, false)) {  //searchtoken.key, searchtoken.findlike)) {
                        case 0:
                            found = cursor
                            //nobreak
                        case 1:
                            closest = cursor
                            cursor = cursor._leftnode
                            break
    
                        case -1:
                            cursor = cursor._rightnode
                            break
                    }
                }
                return findclosest == true ? closest : found
            }
    
            , findlastnode: function (search, findclosest) {
                var list = this
                //var searchtoken = _.make.listsearchtoken(search)
    
                var cursor = list._rootnode
                var closest
                var found
    
                while (cursor) {
    
                    switch (list._compare(this.nodesortvalue(cursor), search, false)) { //searchtoken.key, searchtoken.findlike)) {
                        case 0:
                            found = cursor
                            //nobreak
                        case -1:
                            closest = cursor
                            cursor = cursor._rightnode
                            break
    
                        case 1:
                            cursor = cursor._leftnode
                            break
                    }
                }
    
                return findclosest == true ? closest : found
            }
    
            , findfirstposition: function (search) {
                var node = this.findfirstnode(search)
                return node ? node.position() : 0
            }
    
            , findlastposition: function (search) {
                var node = this.findlastnode(search)
                return node ? node.position() : 0
            }
        }
    })
})