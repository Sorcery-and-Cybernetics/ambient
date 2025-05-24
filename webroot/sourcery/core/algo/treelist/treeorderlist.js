//*************************************************************************************************
// treeorderlist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("treeorderlist", function (_) {
    _.define.treebaselist("treeorderlist", function () {
        this._rootnode = undefined

        this.pushfirst = function (item) {
            var node = this.first()

            this.insertnodebefore(found, node);
            return this
        }

        this.push = function (item) {
            var node = this.last()

            this.insertnodeafter(found, node)
            return this
        }
    })
})