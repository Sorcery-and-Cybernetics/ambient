//****************************************************************************************************************************
// rootmodule - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("sourcery/loader/rootmodule", function(_) {
    _.define.object("rootmodule", function() {
        this._parent = undefined
        this._name = ""
        this._loader = undefined
        this._rule = ""
        this._isloaded = false
        this._modules = undefined

        this.construct = function(parent, name, rule) {
            this._parent = parent._loader? parent: undefined
            this._loader = parent._loader? parent._loader: parent
            this._modules = []
            this._name = name
            this._rule = rule
            this._loader.modules[this.fullpath()] = this
            if (this._parent) { this._parent._modules.push(this) }
        }

        this.parent = function() { return this._parent }
        this.loader = function() { return this._loader }
        this.isrootmodule = function() { return true }
        this.isrequiremodule = function() { return false }
        this.istop = function() { return this._parent? false: true }
        this.rule = function() { return this._rule }
        this.name = function() { return this._name }
        this.path = function() { return (this._parent? this._parent.path(): "") + this._name }
        this.fullpath = function() { return (this._parent? this._parent.path(): "") + this._name }
        this.isloaded = function(value) {
            if (value === undefined) { return this._isloaded }
            this._isloaded = value
            return this
        }
        this.include = function(name, rule) {
            if (_.filesystem.isdir$(name)) {
                _.make.rootmodule(this, name, rule)
            } else {
                _.make.module(this, name, rule)
            }
            return this
        }
        this.require = function(name, rule) {
            _.make.requiremodule(this, name, rule)
            return this
        }
        this.foreachmodule = function(callback) {
            for (var key in this._modules) {
                var module = this._modules[key]
                var result = callback(module, key)
                if (result) { return result }
            }
        }
        this.load = function(god) {
            if (!god) { throw "Error: Rootmodule.load requires a god"}
            if (!this.isloaded()) { god.loadmodule(this); return false }
            god.loaded[this.fullpath()] = true
            var paths = []
            for (var i = 0; i < this._modules.length; i++) {
                var module = this._modules[i]
                if (god.checkrule(module)) {
                    if (module.isrequiremodule()) {
                        if (!module.load(god)) { return false }
                    } else {
                        var subpaths = module.load(god)
                        if (!subpaths) { return false }
                        if (_.isstring(subpaths)) { paths.push(subpaths) }
                        else if (_.isarray(subpaths)) { paths = paths.concat(subpaths) }
                    }
                }
            }
            return paths
        }
    })
})
