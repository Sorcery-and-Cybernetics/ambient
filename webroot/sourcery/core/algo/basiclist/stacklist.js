//*************************************************************************************************
// stacklist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.core.linkedlist("core.stacklist", function (supermodel) {
        this.push = function (value) {
            if (!value) {
                throw "error"
            }

            if (!(value instanceof _.make.core.linkedlistnode)) { value = this.__makenode(value) }
            //return value.assignbefore(this)
            return value.assign(this, -1)
        }

        this.pop = function () {
            var cursor = this.nodelast()
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

            if (!(value instanceof _.make.core.linkedlistnode)) { value = this.__makenode(value) }
//            return value.assignafter(this)
            return value.assign(this, 1)
        }

        this.popfirst = function () {
            var cursor = this.nodefirst()
            var value

            if (cursor) {
                value = cursor._value
                cursor.destroy()
            }
            return value
        }
    })
})
