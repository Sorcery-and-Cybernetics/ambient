//*************************************************************************************************
// behavior - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("behavior", function (_) {
    _.behavior = function (proto) {
        if (!proto) { return }
        if (!_.isfunction(proto)) { throw "_.behavior: Function exptected." } 

        var behavior = {}
        if (proto.call(behavior)) { throw "_.behavior: No return value allowed." }

        behavior._modelname = "behavior"
        return behavior
    }

    _.behavior._modelname = "behavior"

    _.define.behavior = function(name, behavior) {
        _.behavior[name] = behavior
    }
})