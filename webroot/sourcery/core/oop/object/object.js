//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("object").source(function (_) {
    _.model = function() {}
    _.model.object = function () { }

    _.model.object.prototype = {
        _parent: null
        , _name: null
        , _modelname: "object"
        , _supermodel: null
        , _phase: 0
        , _definition: null

        , parent: function() { return this._parent }
        , name: function() { return this._name }        
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
        , assign: function(parent, name) {
            this._parent = parent
            this._name = name
            return this
        }
        , destroy: _.noop

        , debugout: function() {}
        , debugvalidate: function() {}
    } 
})









