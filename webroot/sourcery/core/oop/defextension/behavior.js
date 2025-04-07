//*************************************************************************************************
// behavior - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("behavior", function (_) {
    _.behavior = function (proto) {
        if (!proto) {
            return
        } else {
            if (_.isfunction(proto)) {
                //Backwards compatible. 
                var context = { }
                var behavior = proto.call(context) 

                if (!behavior) { behavior = context }
            } else {
                behavior = proto
            }

            behavior._modelname = "behavior"
            return behavior
        }
    }

    _.behavior._modelname = "behavior"

    _.define.behavior = function(name, behavior) {
        _.behavior[name] = behavior
    }
})