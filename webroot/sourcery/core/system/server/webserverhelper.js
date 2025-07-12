//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.define.module("webserverhelper", function (_) {
    _.define.helper("webserverhelper", function() {
        this.findroute = function (path) {
            var routes = this.routes["http"]

            if (!path || !path.length || !path[0]) {
                return routes["*"] || null
            }

            for (var index = 0; index < path.length; index++) {
                var subpath = path[index]

                if (subpath) {
                    if (!routes[subpath]) {
                        routes = routes["*"] || null

                        if (!routes || _.isfunction(routes)) {
                            return routes
                        }
                    } else {
                        routes = routes[subpath]
                    }
                }
            }
            return routes
        }
    })
})

