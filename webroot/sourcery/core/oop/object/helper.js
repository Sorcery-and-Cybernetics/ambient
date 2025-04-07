//*************************************************************************************************
// helper - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("helper").source(function (_) {
    _.define.helper = function(name, source) {
        if (_.isfunction(source)) { 
            //Backwards compatible. 
            var context = {}
            source = source.call(context) 
            if (!source) { source = context }
        }
        
        var helper = new _.model.core.object()

        _.json.merge(helper, source)

        _.helper[name] = helper
        helper.initialize()
    }
})