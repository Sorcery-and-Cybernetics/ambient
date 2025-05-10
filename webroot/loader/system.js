//*************************************************************************************************
// system - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("system", function () {
        return {
            worlds: null
            , config: null

            , construct: function(config) {
                this.config = config
                this.worlds = {}
            }

            , createworld: function(name, config, next) {
                var me = this
                
                var god = _.make.god(_, name, config)
                    .onfinish(function(world) {
                        _.debug("World " + name + " is created")
                        me.worlds[world.name] = world
                        next()
                    })
        
                _.foreach(config.roles, function(role) {
                    god.addrole(role)
                })            
            
                _.foreach(config.requires, function(require) {
                    god.require(require)
                })
        
                god.start()
            }            
        }
    })
}) (_.ambient)