//*************************************************************************************************
// helper - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("helper").source(function (_) {
    _.define.helper = function(name, source) {
        if (_.isfunction(source)) { 
            var context = {}
            source = source.call(context) 
            if (source) { throw "helper.helper: No return value allowed." }
            source = context
        }
        
        var helper = new _.model.core.object()

        _.json.merge(helper, source)

        _.helper[name] = helper
        helper.construct()
    }
})