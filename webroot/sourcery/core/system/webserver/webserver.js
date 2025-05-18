//*************************************************************************************************
// webserver - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("webserver")
.source(function (_) {
    _.define.core.object("webserver", function() {
        this._server = undefined;
        this._port = undefined;
        this._host = 80;

        this.construct = function(host, port) {
            this._host = host;
            if (port) { this._port = port }

        }

        this.start = function() {
            var me = this;            
            var server = _.make.httpserver(this._host, this._port)

            server.onerror(function(err) {
                me.handleerror(err);
            })
            .onrequest(function(response) {
                me.handleresponse(response)
            })

            this._server = server;
            this._server.start();
            
            return this;
        }
        
        this.stop = function() {
            this._server.stop();
            return this;
        }

        this.handleerror = function(response, message, errcode) {
            var errcode = errcode || 404
            var params = [response.url]

            params.push(sessiontoken)

            if (sessiontoken) { params = params.concat(sessiontoken) }

            response.senderror(errordescription, errcode, params)

            response.senderror(error)
            return this.onerror(error)
        }

        this.handlefileresponse = function(response) {
            //todo: check file exist
            //todo: check file rights


        }

        this.handleresponse = function(response) {
            var path = response.path
            var routedef = null  //_.findroute(path)

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

  