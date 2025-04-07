//*************************************************************************************************
// loader - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************

if (typeof global == "undefined") {
    _ = _ || {}
    var isserver = false

} else {
    global._ = global._ || {} 
    _ = global._
    var isserver = true
}

_.ambient = _.ambient || {}

_.ambient.productpath = ""
_.ambient.libpath = ""

_.system = null


; (function(_) {
    _.isserver  =  isserver

    _.modules = {}
    _.worlds = {}

    _.currentpath = ""
    _.rootmodule = null    

    _.rootmodule = function(name) {
        var module = _.modules[_.currentpath]

        if (!module || (module.name() != name)) {
            throw new Error("Module " + path + " doesn't exist.")
        }

        module.isloaded(true)

        return module
    }
        
    _.module = function (name, source) {
        var module = _.modules[_.currentpath]

        if (!module || (module.name() != name)) {
            throw new Error("Root module " + path + " doesn't exist.")
        }

        if (source) { module.source(source) }
        module.isloaded(true)
        return module
    }

    _.start = function(config) {
        _.config = _.loadconfig(config)
        _.modules._root = _.make.rootmodule(_, "", "")

        _.system = _.make.system(config)
        _.createworlds(config.worlds)

        // _.createworld("testserver", { "name": "testserver", "rules": ["server"] }, function() {
        //     _.debug("world created")
        // })

        return _
    }

    _.createworlds = function() {
        for (var index = 0; index < _.config.worlds.length; index++) {
            var worldconfig = _.config.worlds[index]

            if (!_.system.worlds[worldconfig.name]) {
                _.system.createworld(worldconfig.name, worldconfig, _.createworlds)
                return
            }
        }

        _.debug("All worlds are created")
    }



            // //this goes to creating worlds
            
            // foreach(_.config.role, function (rolename) {
            //     if (rolename) { me.addrole(rolename) }
            // })
            
            // //Add roles for each local harborroute
            // foreach(scope.config.harbor, function (value, name) {
            //     if (!value.ocean) {
            //         me.addrole(name)
            //     }
            // })
            
            // scope.isserver = config.isserver || scope.isserver
            // scope.debugmode = config.debugmode
            // scope.devmode = config.devmode
            
            // //load source modules
            // if (scope.isserver) {
            //     this.path = ""
            //     this.updatestate()
            // } else {
            //     this.path = ""
            //     this.updatestate()
            // }    
    

}) (_.ambient)

