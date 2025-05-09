//*************************************************************************************************
// aliasnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************

_.ambient.module("aliasnode", function(_) {    
    _.define.core.object("alias.node", function (supermodel) {
        this._object = null;
        this._links = null

        this.construct = function(object) {
            this._object = object
        }

        this.load = function(data) {
            this.clear()
            this.values = data
        }

        this.getvalue = function(name) {
            return this._object? this._object.get(name) : null
        }

        this.clear = function() {
            if (this.links) {
                _.foreach(this.links, function(link) {
                    link.destroy()
                })
                this.links = null
            }
        } 
        
        this.destroy = function() {
            this.clear()
            supermodel.destroy.call(this)
        }        
    })
})














