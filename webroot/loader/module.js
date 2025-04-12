//*************************************************************************************************
// module - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("module", function (supermodel) {
        return {
            _parent: null
            , _loader: null
            , _name: ""
            , _rule: ""
            , _isloaded: false

            , _source: ""
            , _onload: null
            
            , construct: function (parent, name, rule) {
                this._parent = parent._loader? parent: null
                this._loader = parent._loader? parent._loader: parent

                this._name = name
                this._rule = rule

                this._loader.modules[this.fullpath()] = this
                if (this._parent) {
                    this._parent._modules.push(this)
                }
            }

            , parent: function () { return this._parent }            
            , loader: function () { return this._loader }
            , isrootmodule: function () { return false }
            , isrequiremodule: function () { return false }
            , rule: function () { return this._rule }

            , name: function () { return this._name }            
            , path: function () { return (this._parent? this._parent.path() : "")  }
            , fullpath: function () { return (this._parent? this._parent.path() : "") + this._name }

            , isloaded: function (value) { 
                if (value === undefined) { return this._isloaded }
                this._isloaded = value
                return this
            }

            , source: function (source) { 
                if (source === undefined) { return this._source }
                this._source = source

                return this
            }

            , require: function (name, rule) {
                _.make.requiremodule(this, name, rule)
                return this
            }    

            , load: function(god) {
                if (!god) { throw "Error: Module.load requires a god"}

                god.loaded[this.fullpath()] = true
                if (this._isloaded) { return this.fullpath() }

                if (!this.isloaded()) {
                    god.loadmodule(this)
                    return false
                }

                return false                
            }

            , onload: function(source) {
                this._onload = source
                return this                
            }
        }
    })

    
}) (_.ambient)