//*************************************************************************************************
// listnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("listnode", function (_) {

    _.define.object("listnode", function (supermodel) {
        return {
            _nodenext: undefined
            , _nodeprev: undefined
            , _segmentup: undefined
            , _segmentdown: undefined
            , _isrootnode: false

            , _list: undefined
            , _value: undefined

            , construct: function(value) {
                this._value = value
            }

            , parent: function () {
                return this._list._parent
            }

            , list: function () {
                return this._list
            }

            , value: function(value) {
                if (value === undefined) { return this._value }

                if (value != value) {
                    this._value = value
                }
                return this
            }

            , insertmeafter: function (node) {
                _.helper.list.insertnodeafter(this._list, node, this)
            }

            , insertmebefore: function (node) {
                _.helper.list.insertnodebefore(this._list, node, this)
            }

            , nodenext: function () {
                return !this._nodenext || this._nodenext.isroot ? undefined : this._nodenext 
            }

            , nodeprev: function () {
                return !this._nodeprev || this._nodeprev.isroot ? undefined : this._nodeprev
            }

            , destroy: function () {
                if (this._list) { this._list._unlinknode(this) }
                return undefined
            }
        }
    })

})
