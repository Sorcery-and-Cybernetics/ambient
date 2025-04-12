//*************************************************************************************************
// requiremodule - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("requiremodule", function (supermodel) {
        return {
            _parent: null
            , _loader: null
            , _name: ""
            , _rule: ""
            , _isloaded: false

            , _source: ""
            
            , construct: function (parent, name, rule) {
                this._parent = parent._loader? parent: null
                this._loader = parent._loader? parent._loader: parent

                this._name = name
                this._rule = rule

                if (this._parent) {
                    this._parent._modules.push(this)
                }                
            }
            
            , parent: function () { return this._parent }            
            , loader: function () { return this._loader }
            , isrootmodule: function () { return false }
            , isrequiremodule: function () { return true }
            , rule: function () { return this._rule }

            , name: function () { return this._name }            

            , load: function(god) {
                if (god.isloaded(this.name())) { return true }
                god.require(this.name())
                return false
            }
        }
    })

    
}) (_.ambient)