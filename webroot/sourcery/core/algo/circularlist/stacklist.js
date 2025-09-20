//*************************************************************************************************
// stacklist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.circularlist("stacklist", function (supermodel) {
        this.first = function() { return this.firstnode()? this.firstnode().value(): null }
        this.last = function() { return this.lastnode()? this.lastnode().value(): null }

        this.push = function (value) {
            if (!value) { throw "Error: stacklist.push - value is null" }

            if (!(value instanceof _.model.circularlistnode)) {
                value = _.model.circularlistnode(value)
            }

            return value.assign(this, 0) // 0 → append at end
        }

        this.pop = function () {
            var cursor = this.lastnode()
            var value = null

            if (cursor) {
                value = cursor.value()
                cursor.destroy()
            }

            return value
        }

        this.pushfirst = function (value) {
            if (!value) { throw "Error: stacklist.pushfirst - value is null" }

            if (!(value instanceof _.model.circularlistnode)) {
                value = _.model.circularlistnode(value)
            }

            return value.assign(this, 1) // 1 → insert at head
        }

        this.popfirst = function () {
            var cursor = this.firstnode()
            var value = null

            if (cursor) {
                value = cursor.value()
                cursor.destroy()
            }

            return value
        }
    })
})
