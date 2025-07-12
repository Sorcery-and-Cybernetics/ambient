//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

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