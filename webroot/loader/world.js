//*************************************************************************************************
// world - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("world", function () {
        return {
            system: null
            , name: null
            , core: null
            
            , construct: function (system, name) {
                this.system = system
                this.name = name

                this.core = {
                    __modules: []
                }
            }

            , create: function() {
                var me = this
                var tests = []

                _.foreach(this.core.__modules, function(module) {
                    var source = module.source()
                    if (source) { source(me) }

                    tests = tests.concat(module._tests)
                })

                this.helper.oop.rundefiners()

                if (!tests.length) { return me.load() }
                
                _.foreachasync(tests, function(test, next) {
                    test.fntest.call(test, function() {
                        next()
                    })
                }, function() {
                    me.load()
                })
                return me                
            }
            
            , load: function() {
                var me = this
                
                _.foreach(this.core.__modules, function(module) {
                    if (module._onload) { module._onload(me) }
                }) 
                return this
            }
        }
    })
}) (_.ambient)