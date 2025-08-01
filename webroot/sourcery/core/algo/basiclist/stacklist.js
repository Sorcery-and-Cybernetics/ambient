//*************************************************************************************************
// stacklist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.linkedlist("stacklist", function (supermodel) {
        this.push = function (value) {
            if (!value) {
                throw "error"
            }

            if (!(value instanceof _.model.linkedlistnode)) { value = this._makenode(value) }
            //return value.assignbefore(this)
            return value.assign(this, -1)
        }

        this.pop = function () {
            var cursor = this.lastnode()
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

            if (!(value instanceof _.model.linkedlistnode)) { value = this._makenode(value) }
//            return value.assignafter(this)
            return value.assign(this, 1)
        }

        this.popfirst = function () {
            var cursor = this.firstnode()
            var value

            if (cursor) {
                value = cursor._value
                cursor.destroy()
            }
            return value
        }
    })
})
