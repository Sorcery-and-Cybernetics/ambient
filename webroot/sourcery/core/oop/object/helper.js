//*************************************************************************************************
// helper - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("helper").source(function (_) {
    _.define.helper = function(name, source) {
        source = _.normalize(source)
        
        var helper = new _.model.core.object()

        _.json.merge(helper, source)

        _.helper[name] = helper
        helper.initialize()
    }
})