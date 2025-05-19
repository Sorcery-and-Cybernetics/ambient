//*************************************************************************************************
// stacklist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.linkedlist("stacklist", function (supermodel) {
        this.push = function (value) {
            if (!value) {
                throw "error"
            }

            if (!(value instanceof _.make.linkedlistnode)) { value = this.__makenode(value) }
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

            if (!(value instanceof _.make.linkedlistnode)) { value = this.__makenode(value) }
//            return value.assignafter(this)
            return value.assign(this, 1)
        }

        this.popfirst = function () {
            var cursor = this.nodefirst()
            var value

            if (cursor) {
                value = cursor.__value
                cursor.destroy()
            }
            return value
        }
    })
})
