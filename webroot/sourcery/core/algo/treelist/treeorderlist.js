//*************************************************************************************************
// treeorderlist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("treeorderlist", function (_) {
    _.define.core.treebaselist("core.treeorderlist", function () {
        return {
            _rootnode: null
    
            , pushfirst: function (item) {
                var node = this.first()
    
                this.insertnodebefore(found, node)
                return this
            }
    
            , push: function (item) {
                var node = this.last()
    
                this.insertnodeafter(found, node)
                return this
            }
    
        }
    })    
})