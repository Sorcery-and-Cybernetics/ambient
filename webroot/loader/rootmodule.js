//*************************************************************************************************
// rootmodule - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("rootmodule", function () {
        return {
            _parent: null
            , _name: ""
            , _loader: null
            , _rule: ""
            , _isloaded: false

            , _modules: null
            
            , construct: function (parent, name, rule) {
                this._parent = parent._loader? parent: null
                this._loader = parent._loader? parent._loader: parent
                this._modules = []

                this._name = name
                this._rule = rule

                this._loader.modules[this.fullpath()] = this
                if (this._parent) {
                    this._parent._modules.push(this)
                }
            }

            , parent: function () { return this._parent }
            , loader: function () { return this._loader }
            , isrootmodule: function () { return true }
            , isrequiremodule: function () { return false }
            , istop: function () { return this._parent? false: true }
            , rule: function () { return this._rule }

            , name: function () { return this._name }            
            , path: function () { return (this._parent ? this._parent.path() : "") + this._name }
            , fullpath: function () { return (this._parent ? this._parent.path() : "") + this._name }

            , isloaded: function (value) { 
                if (value === undefined) { return this._isloaded }

                this._isloaded = value
                return this
            }


            // , find: function(path) {
            //     var parts = _.split$(path, "/", 2)
            //     var part = parts[0]

            //     if (!part) { return null }
            //     return this._modules[part].find(part[1])
            // }

            , include: function (name, rule) {
                if (_.filesystem.isdir$(name)) {
                    _.make.rootmodule(this, name, rule)
                } else {
                    _.make.module(this, name, rule)
                }

                return this
            }

            , require: function (name, rule) {
//                if (!_.filesystem.isdir$(name)) { throw "Error: require requires a directory" }
                _.make.requiremodule(this, name, rule)
                return this
            }            

            , foreachmodule: function (callback) {
                for (var key in this._modules) {
                    var module = this._modules[key]
                    var result = callback(module, key)

                    if (result) { return result }
                }
            }

            , load: function (god) {
                if (!god) { throw "Error: Rootmodule.load requires a god"}

                if (!this.isloaded()) {
                    god.loadmodule(this)
                    return false
                }

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

                            if (_.isstring(subpaths)) { 
                                paths.push(subpaths)
                            } else if (_.isarray(subpaths)) {
                                paths = paths.concat(subpaths)
                            }
                        }
                    }
                }
                return paths
            }

        }
    })   

}) (_.ambient) 

