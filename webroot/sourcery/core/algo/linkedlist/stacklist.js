//*************************************************************************************************
// stacklist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.object("stacklist", function (supermodel) {
        this._nodes = null

        this.construct = function () {
            this._nodes = _.model.linkedlistroot()
        }

        this.first = function () { var item = this._nodes.firstnode(); return item? item.value(): null }
        this.last = function () { var item = this._nodes.lastnode(); return item? item.value(): null }

        this.count = function () { return this._nodes.count() }

        this.push = function (value) {
            if (!value) {
                throw "error"
            }

            if (!(value instanceof _.model.linkedlistnode)) { value = this._nodes._makenode(value) }
            return value.assign(this._nodes, -1)
        }

        this.pop = function () {
            var cursor = this._nodes.lastnode()
            var value

            if (cursor) {
                value = cursor.value()
                cursor.destroy()
            }
            return value
        }

        this.pushfirst = function (value) {
            if (!value) {
                throw "error"
            }

            if (!(value instanceof _.model.linkedlistnode)) { value = this._nodes._makenode(value) }
            return value.assign(this._nodes, 1)
        }

        this.popfirst = function () {
            var cursor = this._nodes.firstnode()
            var value

            if (cursor) {
                value = cursor._value
                cursor.destroy()
            }
            return value
        }
    })
})
