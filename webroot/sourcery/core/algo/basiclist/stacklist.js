//*************************************************************************************************
// stacklist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("stacklist", function (_) {
    _.define.core.linkedlist("core.stacklist", function (supermodel) {
        return {
            push: function (value) {
                if (!value) {
                    throw "error"
                }

                if (!(value instanceof _.make.core.linkedlistnode)) { value = this.__makenode(value) }
                //return value.assignbefore(this)
                return value.assign(this, -1)
            }
    
            , pop: function () {
                var cursor = this.lastnode()
                var value
    
                if (cursor) {
                    value = cursor.value()
                    cursor.destroy()
                }
                return value
            }
    
            , pushfirst: function (value) {
                if (!value) {
                    throw "error"
                }

                if (!(value instanceof _.make.core.linkedlistnode)) { value = this.__makenode(value) }
//                return value.assignafter(this)
                return value.assign(this, 1)
            }
    
            , popfirst: function () {
                var cursor = this.firstnode()
                var value
    
                if (cursor) {
                    value = cursor._value
                    cursor.destroy()
                }
                return value
            }            
        }
    })
})
