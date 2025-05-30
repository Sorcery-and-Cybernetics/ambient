//*************************************************************************************************
// aliasdb - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************

_.ambient.module("aliasdb", function(_) {    
    _.define.object("alias.db", function (supermodel) {
        this.nodes = undefined
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