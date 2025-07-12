//*************************************************************************************************
// linkedlistnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("linkedlistnode", function (_) {

    _.define.object("linkedlistnode", function (supermodel) {
        this._nodenext = null
        this._nodeprev = null

        this._list = null
        this._value = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(value) {
                this._value = value
            }

            this.assign = function(cursor, index) {
                if (!cursor) { throw "Error: linkedlistnode.insertmebefore. Cursor is null"; }
                if (cursor == this) { return this }
                if (this._list) { this.unlink() }

                var list = (cursor instanceof _.model.linkedlist ? cursor : cursor._list)

                if (Math.abs(index) <= list.count()) { 
                    if (index < 0) {
                        while (index < -1) {
                            cursor = cursor._nodeprev
                            index += 1
                        }

                    } else {
                        while (index > 0) {
                            cursor = cursor._nodenext
                            index -= 1
                        }
                    }
                } 

                // while (index) {
                //     if (index < -1) {
                //         cursor = cursor._nodeprev
                //         if (cursor == list) { break }
                //         index += 1

                //     } else {
                //         cursor = cursor._nodenext
                //         if (cursor._nodenext == list) { break }
                //         index -= 1
                //     }
                // }

                this._list = list
                list._count += 1

                this._nodenext = cursor
                this._nodeprev = cursor._nodeprev

                this._nodeprev._nodenext = this
                this._nodenext._nodeprev = this

                return this
            }

            this.unlink = function() {
                if (this.list()) {
                    this._list._count -= 1
                }

                if (this._nodenext) { this._nodenext._nodeprev = this._nodeprev }
                if (this._nodeprev) { this._nodeprev._nodenext = this._nodenext }

                this._list = null
                this._nodenext = null
                this._nodeprev = null
            }

            this.destroy = function () {
                if (this._list) { this.unlink() }
                return null
            }
        });

        this.modelbehavior = _.behavior(function() {
            this.parent = function () {
                return this._list._parent
            }

            this.list = function () {
                return this._list
            }

            this.isroot = function() { return false }

            this.value = function(value) {
                if (value === undefined) { return this._value }

                if (value != value) {
                    this._value = value
                }
                return this
            }
        });

        this.navigationbehavior = _.behavior(function() {
            this.nodenext = function () {
                return !this._nodenext || (this._nodenext == this._list ? null : this._nodenext)
            }

            this.nodeprev = function () {
                return !this._nodeprev || (this._nodeprev == this._list ? null : this._nodeprev)
            }
        })
    })

})
