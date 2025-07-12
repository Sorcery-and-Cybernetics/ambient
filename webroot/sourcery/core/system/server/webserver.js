//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("webserver").source(function (_) {
    _.define.object("webserver", function() {
        this._server = null;
        this._port = null;
        this._host = 80;

        this.construct = function(host, port) {
            this._host = host;
            if (port) { this._port = port }

        }

        this.start = function() {
            var me = this;            
            var server = _.model.httpserver(this._host, this._port)

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

        this.handleerror = function(response, error) {
            response.senderror(error)
            return this.onerror(error)
        }        

        this.handlefileresponse = function(response) {
            //todo: check file exist
            //todo: check file rights
            //todo: send file
            return response.sendfile(response.url)
        }

        this.handleresponse = function(response) {
            var path = response.path
            var routedef = null  //_.findroute(path)

            if (routedef) {
                if (!_.isfunction(routedef)) { return this.handleerror(response, "Route not found") }
                routedef(response)
                
            } else {
                 this.handlefileresponse(response)
            }
        }

        this.onerror = _.model.basicsignal();
    })
})

  