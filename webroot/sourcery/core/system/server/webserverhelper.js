_.define.module("webserverhelper", function (_) {
    _.define.helper("webserverhelper", function() {
        this.findroute = function (path) {
            var routes = this.routes["http"]

            if (!path || !path.length || !path[0]) {
                return routes["*"] || undefined
            }

            for (var index = 0; index < path.length; index++) {
                var subpath = path[index]

                if (subpath) {
                    if (!routes[subpath]) {
                        routes = routes["*"] || undefined

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

