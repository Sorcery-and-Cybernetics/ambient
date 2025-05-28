//*************************************************************************************************
// modelvalue - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("modelvalue", function(_) {
    _.define.object("modelvalue", function (supermodel) {
        this._initial = undefined
        this._self = undefined
        this._value = undefined

        this.construct = function (value) {
            if (value) { this.let(value) }
        }

        this.initial = function(value) {
            if (value === undefined) { return this._initial }

            if (_.isobject(value)) { throw "Error: Object not allowed" }
            this._initial = value
            return this
        }

        this.self = function () {
            if (this.hasself()) { return this._self._self }
            return undefined
        }

        this.hasself = function() { return this._self? true: false }

        this.value = function (value) {
            if (value === undefined) { return this.get() }            
            
            this.let(value)
            return this
        }

        this.let = function (value) {
            if (this._self) { this._self.destroy() }

            if (_.isobject(value)) { value = value.value() }
            if (value == this._value) { return this }
            this._value = value

            return this
        }

        this.set = function (value) {
            if (!_.isobject(value)) {
                //Todo: Model values can only be set to other model values, so this shouldn't be possible.
                //Todo: But maybe I am wrong here. We will see in the future.
                //todo: recognize value and create the appropriate modelvalue
                //todo: If self is of same type of model and the parent == this, just set value of the self
                throw "Error" 
            }

            //todo: add check to see if value type matches, self can only be set if it is part of the inheritance chain.
            this._value = undefined
            _.modelagent.assignself(this, value)
            return this
        }

        this.get = function () {
            var self = this.self()
            var value

            if (self) {
                if (self instanceof _.model.model) { return self }  //Todo: Model values can only be set to other model values, so this shouldn't be possible.
                value = self.value()
            } else {
                value = this._value || this._initial
            }
            //todo: Implement calculated values
            return value
        }
    })  
})
