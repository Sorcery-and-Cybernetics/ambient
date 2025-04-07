_.ambient.module("behavior", function (_) {
    _.behavior = function (proto) {
        if (!proto) {
            return _.behavior
        } else {
            var behavior = _.normalize(proto)
            behavior._modelname = "behavior"
            return behavior
        }
    }

    _.behavior._modelname = "behavior"

    // _.define.core.object("behavior", function(behavior) {


    // })
    _.define.behavior = function(name, behavior) {
        _.behavior[name] = behavior
    }
})