//*************************************************************************************************
// listnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("listnode", function (_) {

    _.define.core.object("listnode", function (supermodel) {
        return {
            __nextnode: null
            , __prevnode: null
            , __segmentup: null
            , __segmentdown: null
            , __isrootnode: false

            , __list: null

            , _value: null

            , construct: function(value) {
                this._value = value
            }

            , parent: function () {
                return this.__list._parent
            }

            , list: function () {
                return this.__list
            }

            , value: function(value) {
                if (value === undefined) { return this._value }

                if (value != value) {
                    this._value = value
                }
                return this
            }

            , insertmeafter: function (node) {
                _.helper.list.insertnodeafter(this.__list, node, this)
            }

            , insertmebefore: function (node) {
                _.helper.list.insertnodebefore(this.__list, node, this)
            }

            , nextnode: function () {
                return !this.__nextnode || this.__nextnode.isroot ? null : this.__nextnode 
            }

            , prevnode: function () {
                return !this.__prevnode || this.__prevnode.isroot ? null : this.__prevnode
            }

            , destroy: function () {
                if (this.__list) { this.__list.__unlinknode(this) }
                return null
            }
        }
    })

})
