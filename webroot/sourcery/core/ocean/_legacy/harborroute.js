_.define.module("harborroute")
.asmodule(function (scope) {
    function initmethod(proto, name, definition) {
        if (_.isfunction(definition)) {
            definition = _.method(definition, null)
            method = definition.make(proto, name)
        }
        
        return definition.make(proto, name)
    }

    return {
        routetype: ""
        , isrootmodule: true

        , make: function (source) {
            var me = this
            var scope = me.loader.scope

            source = _.normalize(source, scope)
            var routes = scope.routes

            if (!routes) {
                routes = {}
                scope.routes = routes
            }

            if (this.routetype) {
                if (!routes[this.routetype]) { routes[this.routetype] = {} }
                routes = routes[this.routetype]

                if (!_.isobject(routes)) { throw "error" }
            }

            if (source instanceof _.kind.defextender.method) {
                //source is a method definition
                if (routes[me.name]) { throw "error" }

                routes[me.name] = source.define(me, me.name)

            } else {
                //source is a collection of methods
                if (!routes[me.name]) { routes[me.name] = {} }
                routes = routes[me.name]
                if (!_.isobject(routes)) { throw "error" }

                _.foreach(source, function (definition, methodname) {
                    if (!_.isfunction(definition)) {
                        routes[methodname] = definition.define(me, methodname)
                    }
                })
            }
        }
    }
})

_.define.harborroute("coreroute")
.asmodule(function () {
    return {
        routetype: "coreserver"
    }
})

_.define.harborroute("dataroute")
.asmodule(function () {
    return {
        routetype: "dataserver"
    }
})

_.define.harborroute("authserverroute")
.asmodule(function () {
    return {
        routetype: "authserver"
    }
})

//_.define.harborroute("sessionroute")
//.asmodule(function () {
//    return {
//        routetype: "serversession"
//    }
//})

_.define.harborroute("clientsession")
    .asmodule(function () {
        return {
            routetype: "clientsession"
        }
    })