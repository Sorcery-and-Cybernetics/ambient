//*************************************************************************************************
// aliasnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************

_.ambient.module("aliasnode", function(_) {    
    _.define.object("alias.node", function (supermodel) {
        this._object = undefined
        this._links = undefined

        this.construct = function(object) {
            this._object = object
        }

        this.load = function(data) {
            this.clear()
            this.values = data
        }

        this.getvalue = function(name) {
            return this._object? this._object.get(name) : undefined
        }

        this.clear = function() {
            if (this._links) {
                _.foreach(this._links, function(link) {
                    link.destroy()
                })
                this._links = undefined
            }
        } 
        
        this.destroy = function() {
            this.clear()
            supermodel.destroy.call(this)
        }        
    })
})














