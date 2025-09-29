//todo: clientroutes should also have an adress

_.define.module("clientroute")
    .asmodule(function () {

        return {
            make: function (source) {
                var me = this
                var scope = me.loader.scope

                scope.routeout = scope.routeout || {}

                if (scope.routeout[me.name]) { throw "error: clientroute already exists" }

                var routes = {}

                _.foreach(source, function (definition, methodname) {
                    if (_.isfunction(definition)) {
                        routes[methodname] = definition
                    } else {
                        routes[methodname] = definition.define(me, methodname)
                    }
                })

                scope.routeout[me.name] = routes
            }
        }
    })
