//*************************************************************************************************
// method - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("method", function (_) {
    var makemethod = function (def, proto) {      
        return def._source
    }

    _.define.defextender("method", function(supermodel) {
        this.params = null
        this.paramnames = null

        this.construct = function(source, args) {
            this.params = {}
            this.paramnames = []

            if (source) { this.source(source) }
            //todo: if source is given and arguments are missing make argument definition
            if (args) { this.arguments(args) }
        }            

        this.definetrait = function (modeldef, traitname) {
            this._parent = modeldef
            this.name = traitname

            var result = makemethod(this, modeldef)
            result.definition = this

            return result            
        }

        this.source = function (fn) {
            if (fn === undefined) { return this._source }

            this._source = fn
            return this
        }        

        this.arguments = function (value) {
            if (value == null) {
                return this.params
            }

            var me = this
            me.params = value
            me.paramnames = []

            _.foreach(this.params, function(value, key) {
                me.paramnames.push(key)
            })

            return this
        }        
    })
})