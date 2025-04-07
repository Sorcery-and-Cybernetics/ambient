//*************************************************************************************************
// object - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("object").source(function (_) {
    _.model.core = {}
    _.model.core.object = function () { }

    _.model.core.object.prototype = {
        _modelname: "object"
        , _supermodel: null
        , _phase: 0
        
        , modelname: function () { return this._modelname }
        , initialize: _.noop
        , assign: _.noop
        , destroy: _.noop

        , debugout: function() {}
        , debugvalidate: function() {}
    } 
})









