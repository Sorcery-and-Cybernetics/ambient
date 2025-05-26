//*************************************************************************************************
// modelvalue - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("modelvalue", function(_) {
    _.define.object("modelvalue", function (supermodel) {
        this._initial = undefined
        this._value = undefined

        this.construct = function (initial) {
            if (initial) { this._initial = initial }
        }

        this.self = function () {
            if (this.hasself()) { return this._value._self }
            return undefined
        }

        this.hasself = function() { return _.isobject(this._value)? true: false }

        this.value = function (value) {
            if (value === undefined) { return this.get() }            
            
            this.let(value)
            return this
        }

        this.let = function (value) {
            if (_.isobject(value)) { value = value.value() }
            if (value == this._value) { return this }

            if (_.isobject(this._value)) { this._value.destroy() }
            this._value = value

            return this
        }

        this.set = function (value) {
            if (!_.isobject(value)) {
                //todo: recognize value and create the appropriate modelvalue
                //todo: If self is of same type of model and the parent == this, just set value of the self
                throw "Error" 
            }

            _.modelagent.assignself(this, value)
            return this
        }

        this.get = function () {
            var self = this.self()
            var value

            if (self) {
                if (!_.ismodelvalue(self)) { return self }
                value = self.value()
            } else {
                value = this._value || this._initial
            }
            //todo: Implement calculated values
            return value
        }
    })  
})
