//*************************************************************************************************
// aliasdb - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************

_.ambient.module("aliasdb", function(_) {    
    _.define.core.object("alias.db", function (supermodel) {
        this.nodes = null
        this.connection = ""

        this.initialize = function(connection) {
            this.connection = connection
            this.nodes = _.make.alias.map()
        }

        this.destroy = function() {
            this.nodes.destroy()
            supermodel.destroy.call(this)
        }
    })
})