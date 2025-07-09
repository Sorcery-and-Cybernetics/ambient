//****************************************************************************************************************************
// Ambient - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("module", function(_) {
    _.define.object("module", function(supermodel) {
        this._parent = undefined
        this._loader = undefined
        this._name = ""
        this._rule = ""
        this._isloaded = false
        this._source = ""
        this._onload = undefined
        this._tests = undefined

        this.construct = function(parent, name, rule) {
            this._parent = parent._loader? parent: undefined
            this._loader = parent._loader? parent._loader: parent
            this._name = name
            this._rule = rule
            this._tests = []

            this._loader.modules[this.fullpath()] = this
            if (this._parent) { this._parent._modules.push(this) }
        }

        this.parent = function() { return this._parent }
        this.loader = function() { return this._loader }
        this.isrootmodule = function() { return false }
        this.isrequiremodule = function() { return false }
        this.rule = function() { return this._rule }
        this.name = function() { return this._name }
        this.path = function() { return (this._parent? this._parent.path(): "") }
        this.fullpath = function() { return (this._parent? this._parent.path(): "") + this._name }

        this.isloaded = function(value) {
            if (value === undefined) { return this._isloaded }
            this._isloaded = value
            return this
        }

        this.source = function(source) {
            if (source === undefined) { return this._source }
            this._source = source
            return this
        }

        this.require = function(name, rule) {
            _.make.requiremodule(this, name, rule)
            return this
        }

        this.load = function(god) {
            if (!god) { throw "Error: Module.load requires a god" }
            god.loaded[this.fullpath()] = true
            if (this._isloaded) { return this.fullpath() }
            if (!this.isloaded()) { god.loadmodule(this); return false }
            return false
        }

        this.onload = function(source) {
            this._onload = source
            return this
        }

        this.ontest = function(testname, source) {
            this._tests.push({ modulepath: this.path(), modulename: this._name, testname: testname, source: source })
            return this
        }
    })
})
