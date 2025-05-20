//*************************************************************************************************
// world - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("world", function () {
        return {
            system: null
            , name: null
            , _modules: null
            
            , construct: function (system, name) {
                this.system = system
                this.name = name

                this._modules = []                
            }

            , create: function() {
                this.load()
                return this
            }
            
            , load: function() {
                var me = this

                _.foreach(this._modules, function(module) {
                    if (module._onload) { module._onload(me) }
                }) 
                
                return this
            }
        }
    })
}) (_.ambient)