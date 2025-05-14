//*************************************************************************************************
// webserver - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("webserver")
.source(function (_) {
    _.define.core.object("webserver", function() {
        this.__server = undefined;
        this.__port = undefined;
        this.__host = 80;

        this.construct = function(host, port) {
            this.__host = host;
            if (port) { this.__port = port }
        }

        this.start = function() {
            var me = this;            
            var server = _.make.httpserver(this.__host, this.__port)

            server.onerror(function(err) {
                me.handleerror(err);
            })
            .onrequest(function(response) {
                me.handleresponse(response)
            })

            this.__server = server;
            this.__server.start();
            
            return this;
        }
        
        this.stop = function() {
            this.__server.stop();
            return this;
        }

        this.handleresponse = function(response) {
            var path = response.path
            var routedef = _.findroute(path)

            if (routedef) {
                if (!_.isfunction(routedef)) { return this.handleerror(response, "Route not found") }
                routedef(response)
                
            } else {
                 var file = _.make.fileroute(path)
                 if (!file) { return this.handleerror(response, "File not found") }
                 file(response)

            }
        }

        this.handleerror = function(response, error) {
            response.senderror(error)
            return this.onerror(error)
        }

        this.onerror = _.make.core.basicsignal();
    })

})

  