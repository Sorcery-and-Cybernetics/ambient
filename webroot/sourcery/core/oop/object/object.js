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
        , _self: null

        , parent: function() { return this._parent }
        , name: function() { return this._name }        
        , modelname: function () { return this._modelname }
        , supermodel: function() { return this._supermodel }
        , ismodel: function(modelname) { return this._modelname === modelname }
        , self: _.noop
        , setdirty: null

        , instanceof: function(modelname) {                 
            var cursor = this

            while (cursor) {
                if (cursor._modelname === modelname) { return true }
                cursor = cursor._supermodel
            }
            return false;
        }        

        , construct: _.noop

        , assign: _.noop
        , assignto: function(parent, name) {
            this._parent = parent
            this._name = name
            return this
        }

        , isdestroy: function() { return this._phase < 0 }
        
        , destroy: function() {
            this._phase = -1
            return this
        }

        , get: function(name) { 
            var value = this[name]
            return (_.isfunction(value)? value.call(this): value)
        }

        , debugout: function() { return this.modelname() }
        , debugjson: function(full) {
            var result = {
                _name: this._name
                , _modelname: this._modelname
            }

            for (var key in this) {
                if (key.startsWith("_")) {
                    switch (key) {
                        case "_name":
                        case "_modelname":
                        case "_parent":
                        case "_supermodel":
                        case "_definition":
                        case "_self":

                            break
                        default:
                            var value = this[key]

                            if (value && _.isfunction(value.debugjson)) {
                                result[key] = value.debugjson()
                            } else if (full) {
                                result[key] = value
                            }
                    }
                }
            }

            return result
        }
        , debugvalidate: function() {}
    } 
})
