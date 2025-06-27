//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("modelagent", function(_) {
    _.define.globalobject("modelagent", function (supermodel) {
        this._selfnodes = undefined
        this._models = undefined
        this._lastuid = 0
        this.basicuidmode = _.model.property(false)
        this.ismaster = _.model.property(true)

        this.construct = function() {
            this._selfnodes = {}
            this._models = {}
        }

        this.registermodel = function(parent, model, orderindex) {
            var uid = model._uid

            if (uid) { 
                if (uid > this._lastuid) { this._lastuid = uid }

            } else {

                if (this.basicuidmode()) {
                    uid = this._lastuid + 1

                } else {
                    uid = _.now()

                    if (uid <= this._lastuid) {
                        uid = this._lastuid + 1
                    }
                }

                this._lastuid = uid
                if (!this.ismaster()) { uid = -uid }
                model._uid = uid
            }

            this._models[uid] = model
            return this
        } 
        
        this.getmodel = function(modelid) {
            return this._models[uid]
        }

        this.unregistermodel = function(model) {
            delete this._models[model._uid]
            return this
        }

        this.assignself = function (me, self) {            
            var meself = me.self()
            if (meself == self) { return }

            if (meself) { meself = meself.destroy() }

            //todo: add to a list
            me._self = _.model.selfnode(me, self)

            return this
        }
    })
})