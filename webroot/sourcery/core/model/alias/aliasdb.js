//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("aliasdb", function(_) {    
    _.define.object("alias.db", function (supermodel) {
        this.nodes = null
        this.connection = ""

        this.construct = function(connection) {
            this.connection = connection
            this.nodes = _.model.alias.map()
        }

        this.destroy = function() {
            this.nodes.destroy()
            supermodel.destroy.call(this)
        }
    })
})