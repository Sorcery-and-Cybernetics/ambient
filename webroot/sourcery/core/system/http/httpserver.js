//*************************************************************************************************
// httpserver - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("httpserver", function (_) {
    var http = require('http')
    var https = require('https')
    var fs = require("fs")

    _.define.object("httpserver", function (supermodel) {
        this.certpath = "./config/";
        this.httpserver = null;
        this.httpsserver = null;

        this.ip = null;
        this.port = 443;
        this.certname = null;
        this.certpassword = null;
        this.certpfx = null;
        this.compress = false;

        this.blockrequests = false;

        // this._onrequest = null;
        // this._onerror = null;

        this.construct = function (name, port) {
            this.name = name;
            if (port) { this.port = port; }
            return this;
        };

        this.onrequest = _.model.basicsignal();
        this.onerror = _.model.basicsignal();

        this.loadcert = function(certname, certpassword) {
            this.certkey = fs.readFileSync(this.certpath + this.certname + ".key");
            this.cert = fs.readFileSync(this.certpath + this.certname + ".crt");
            this.certpassword = this.certpassword;
            return this;
        };

        this.hascertificate = function() {
            return false;
            //this.loadcert()
            //return this.certname && this.certpassword
        };

        this.start = function() {
            var me = this;

            var requesthandler = function (req, res) {
                var response = _.model.httpresponse(me, req, res);
    
                if (me.blockrequests) {
                    response.senderror("Server Unavailable", 503);
                    return;
                }
    
                me.onrequest(response);
            };                

            if (this.hascertificate()) {
                var options = {
                    key: this.certkey,
                    cert: this.cert,
                    passphrase: this.certpassword
                };

                var server = https.createServer(options, requesthandler);

            } else {                    
                var server = http.createServer(requesthandler);
            }

            server
                .on("listening", function (result) {
                    var serverinfo = server.address();
                    _.debug("Server " + me.name + " online on " + serverinfo.address + ":" + me.port);
                })
                .on("error", function (error) {
                    me.onerror("Error - httpserver.createserver " + error.message);

                    // if (!server.listening) {
                    //     _.timer.waitfor(1000, "retry port binding").ontimer(function () { _.createserver(servername, ip, port, cert, serverhandler) })
                    // }
                })
                .on("close", function (result) {
                    _.debug("Server " + me.name + " closed");
                });
                

            this.httpserver = server;
            server.listen(this.port, this.ip || undefined);
                

            return this;
        };

        this.stop = function() {
            this.httpserver.close();
            return this;
        };
    });

});





        // _.startwebserver = function (serverhandler) {
        //     var me = this
        //     var cert = _.config.cert

        //     serverhandler = serverhandler || defaultserverhandler

        //     var port = _.config.arguments.port
        //     _.debug("Starting webserver on port " + port)


        //     _.config.server.httpport = _.config.arguments.port || _.config.server.httpport 

        //     if (hascredentials(cert)) {
        //         if (_.loader.httpserver) { throw "error" }
        //         _.loader.httpserver = _.createserver(_.config.productcode, _.config.server.url, _.config.server.httpsport, cert, serverhandler)
        //         _.loader.blockrequests = false
        //         //_.timer.onday(function () {
        //         //    _.refreshwebserver(serverhandler)
        //         //})

        //         if (!_.loader.redirectserver) {
        //             _.loader.redirectserver = _.createserver("redirect https", _.config.server.url, _.config.server.httpport, null, httpsredirect)
        //         }
        //     } else {
        //         if (_.loader.httpserver) { throw "error" }
        //         _.loader.httpserver = _.createserver(_.config.productcode, _.config.server.url, _.config.server.httpport, null, serverhandler)
        //         _.loader.blockrequests = false
        //     }

        //     return this
        // }
