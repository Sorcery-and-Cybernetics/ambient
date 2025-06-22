//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("treesortlist", function (_) {
    _.define.treebaselist("treesortlist", function () {
        this._rootnode = undefined

//        this.sortkey = _.property("key");

        this.push = function (item) {
            var node = this.makenode(item)
            var value = this.nodesortvalue(item)
            var found = this.findnodelast(value, true)

            this.insertnodeafter(found, node)
            return this;
        };

        this.findnodefirst = function (search, findclosest) {
            var list = this;
            //var searchtoken = _.model.listsearchtoken(search);

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

        this.findnodelast = function (search, findclosest) {
            var list = this
            //var searchtoken = _.model.listsearchtoken(search);

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

        this.findfirstposition = function (search) {
            var node = this.findnodefirst(search)
            return node ? node.position() : 0
        }

        this.findlastposition = function (search) {
            var node = this.findnodelast(search)
            return node ? node.position() : 0
        }
    })
})