//*************************************************************************************************
// object - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("object").source(function (_) {
    _.make = function() {}
    _.make.object = function () { }
    _.model = function() {}

    _.make.object.prototype = {
        _modelname: "object"
        , _supermodel: null
        , _phase: 0
        
        , modelname: function () { return this._modelname }
        , supermodel: function() { return this._supermodel }
        , ismodel: function(modelname) { return this._modelname === modelname }
        , instanceof: function(modelname) {                 
            var cursor = this;

            while (cursor) {
                if (cursor._modelname === modelname) { return true; }
                cursor = cursor._supermodel;
            }
            return false;
         }        
        , construct: _.noop
        , assign: _.noop
        , destroy: _.noop

        , debugout: function() {}
        , debugvalidate: function() {}
    } 
})









