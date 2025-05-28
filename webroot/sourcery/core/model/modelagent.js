//*************************************************************************************************
// modelagent - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("modelagent", function(_) {
    _.define.globalobject("modelagent", function (supermodel) {


        this.construct = function() {
            
        }

        this.assignself = function (me, self) {            
            var meself = me.self()
            if (meself == self) { return }

            if (meself) { meself = meself.destroy() }

            //todo: add to a list
            me._self = _.model.selfnode(me, self)

            return this
        }
    })
})