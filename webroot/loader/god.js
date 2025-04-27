//*************************************************************************************************
// god - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("god", function () {
        return {
            config: null
            , name: ""
            , world: null
            , requires: null
            , loaded: null
            , isstarted: false

            , construct: function(system, name, config) {
                this.name = name
                this.config = config || null

                this.requires = {}
                this.roleengine = _.make.roleengine()
            }

            , start: function () {
                this.isstarted = true
                this.loadmodules()
            }

            , require: function(modulepath) {
                var me = this

                _.debug("Require " + modulepath)

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
                    setTimeout(function() { 
                        _.debug("Timeout triggered")
                        me.loadmodules() 
                    }, 1)
                }

            }

            , checkrequire: function(module) {
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

            , addrole: function(rule) {
                this.roleengine.addrole(rule)
            }

            , checkrule: function(module) {
                if (module.isrequiremodule()) { return true }

                if (!this.checkrequire(module)) { return false }

                var isrequired = module.isrequiremodule()? false: this.requires[module.fullpath()]
                return this.roleengine.checkrule(module.rule(), isrequired)
            }

            , isloaded: function(name) {
                return !!this.loaded[name]
            }

            , loadmodules: function() {
                var me = this

                me.loaded = {}
                var result = _.modules._root.load(me)

                if (!result) { return }

                _.debug(me.name + " All necessary modules are loaded")        
                me.world = _.make.world(me, me.name)

                _.foreach(result, function(modulename) {
                    var module = _.modules[modulename]
                    var source = module.source()
                    if (source) { source(me.world) }
                })

                me.world.helper.oop.rundefiners()

                _.foreach(result, function(modulename) {
                    var module = _.modules[modulename]
                    if (module._onload) { module._onload(me.world) }
                })

                me.onfinished()
            }
            
            , loadmodule: function (module) {
                var me = this

                var path = module.fullpath()
                _.debug(this.name + " is loading: " + path)        
                _.currentpath = path

                path += (module.isrootmodule()? "_root.js": ".js")

                _.filesystem.loadscript(path, function (err, script) {
                    if (err) {
                        throw "Error loading script: " + path
                    } else {
                        me.loadmodules()
                    }
                })
            }            

            , onfinished: function(next) {
                if (_.isfunction(next)) {
                    this._onfinished = next
                    return this
                }
                
                if (this._onfinished) {
                    var next = this._onfinished
                    this._onfinished = null
                    next.call(this, this.world)
                }                
            }

        }
    })
}) (_.ambient)