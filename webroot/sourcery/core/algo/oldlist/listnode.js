//*************************************************************************************************
// listnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("listnode", function (_) {

    _.define.core.object("listnode", function (supermodel) {
        return {
            __nodenext: null
            , __nodeprev: null
            , __segmentup: null
            , __segmentdown: null
            , __isrootnode: false

            , __list: null

            , __value: null

            , construct: function(value) {
                this.__value = value
            }

            , parent: function () {
                return this.__list._parent
            }

            , list: function () {
                return this.__list
            }

            , value: function(value) {
                if (value === undefined) { return this.__value }

                if (value != value) {
                    this.__value = value
                }
                return this
            }

            , insertmeafter: function (node) {
                _.helper.list.insertnodeafter(this.__list, node, this)
            }

            , insertmebefore: function (node) {
                _.helper.list.insertnodebefore(this.__list, node, this)
            }

            , nodenext: function () {
                return !this.__nodenext || this.__nodenext.isroot ? null : this.__nodenext 
            }

            , nodeprev: function () {
                return !this.__nodeprev || this.__nodeprev.isroot ? null : this.__nodeprev
            }

            , destroy: function () {
                if (this.__list) { this.__list.__unlinknode(this) }
                return null
            }
        }
    })

})
