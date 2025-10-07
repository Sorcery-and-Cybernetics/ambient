//*************************************************************************************************
// stacklist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.object("stacklist", function (supermodel) {
        this._nodes = null

        this.construct = function () {
            this._nodes = _.model.chainlist()
        }

        this.first = function () {
            var item = this._nodes.firstnode()
            return item? item.value(): null
        }

        this.last = function () {
            var item = this._nodes.lastnode()
            return item? item.value(): null
        }

        this.count = function () { return this._nodes.count() }

        this.push = function (value) {
            if (!value) { throw "Error: stacklist.push - value is null" }

            if (!(value instanceof _.model.chainlistnode)) {
                value = _.model.chainlistnode(value)
            }

            return value.assignto(this._nodes, 0) // index 0 → append at end
        }

        this.pop = function () {
            var cursor = this._nodes.lastnode()
            var value = null

            if (cursor) {
                value = cursor.value()
                cursor.destroy()
            }

            return value
        }

        this.pushfirst = function (value) {
            if (!value) { throw "Error: stacklist.pushfirst - value is null" }

            if (!(value instanceof _.model.chainlistnode)) {
                value = _.model.chainlistnode(value)
            }

            return value.assignto(this._nodes, 1) // index 1 → insert at head
        }

        this.popfirst = function () {
            var cursor = this._nodes.firstnode()
            var value = null

            if (cursor) {
                value = cursor.value()
                cursor.destroy()
            }

            return value
        }
    })
})
