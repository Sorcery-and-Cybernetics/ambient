//****************************************************************************************************************************
// Ambient - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("god", function(_) {
    _.define.object("god", function() {
        this.config = undefined
        this.name = ""
        this.world = undefined
        this.requires = undefined
        this.loaded = undefined
        this.isstarted = false

        this.construct = function(system, name, config) {
            this.name = name
            this.config = config || undefined
            this.requires = {}
            this.roleengine = _.model.roleengine()
        }

        this.start = function() {
            this.isstarted = true
            this.loadmodules()
        }

        this.require = function(modulepath) {
            var me = this

            if (this.requires[modulepath]) {
                throw "Required module " + modulepath + " can not be loaded."
            }

            this.requires[modulepath] = true
            var parts = _.split$(modulepath, "/")
            var part = ""

            for (var index = 0; index < parts.length - 1; index++) {
                part += parts[index] + "/"
                if (this.requires[part] == null) {
                    this.requires[part] = false
                }
            }

            if (this.isstarted) {
                setTimeout(function() { me.loadmodules() }, 1)
            }
        }

        this.checkrequire = function(module) {
            if (module.isrequiremodule()) { return true }
            var path = module.fullpath()
            if (!path) { return true }
            var parts = _.split$(path, "/")
            var match = ""

            for (var index = 0; index < parts.length - 1; index++) {
                match += parts[index] + "/"
                if (this.requires[match]) { return true }
            }

            if (module.isrootmodule()) {
                if (this.requires[match] != null) { return true }

            } else {
                match += parts[index]
                if (this.requires[match]) { return true }
            }
            return false
        }

        this.addrole = function(rule) { this.roleengine.addrole(rule) }

        this.checkrule = function(module) {
            if (module.isrequiremodule()) { return true }
            if (!this.checkrequire(module)) { return false }

            var isrequired = module.isrequiremodule()? false: this.requires[module.fullpath()]
            return this.roleengine.checkrule(module.rule(), isrequired)
        }

        this.isloaded = function(name) { return !!this.loaded[name] }

        this.loadmodules = function() {
            var me = this

            me.loaded = {}
            var result = _.modules._root.load(me)
            if (!result) { return }

            _.debug(me.name + " All necessary modules are loaded")
            me.world = _.model.world(me, me.name)

            _.foreach(result, function(modulename) {
                var module = _.modules[modulename]
                me.world._modules.push(module)
                var source = module.source()
                if (source) { source(me.world) }
            })
            
            me.world.helper.oop.rundefiners()
            me.world.create()
            me.onfinish()
        }

        this.loadmodule = function(module) {
            var me = this
            var path = module.fullpath()
            _.currentpath = path

            path += (module.isrootmodule()? "_root.js": ".js")

            _.filesystem.loadscript(path, function(err, script) {
                if (err) { throw "Error loading script: " + path }
                else { me.loadmodules() }
            })
        }

        this.onfinish = function(next) {
            if (_.isfunction(next)) { this._onfinish = next; return this }

            if (this._onfinish) {
                var next = this._onfinish
                this._onfinish = null
                next.call(this, this.world)
            }
        }
    })
})
