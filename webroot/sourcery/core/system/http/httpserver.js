//*************************************************************************************************
// httpserver - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("httpserver", function (_) {
    var http = require('http')
    var https = require('https')
    var fs = require("fs")

    _.define.core.object("httpserver", function (supermodel) {
        return {
            certpath: "./config/"
            , httpserver: null
            , httpsserver: null

            , ip: null
            , port: 443
            , certname: null
            , certpassword: null
            , certpfx: null
            , compress: false

            , blockrequests: false

            // , _onrequest: null
            // , _onerror: null

            , initialize: function (name, port) {
                this.name = name
                if (port) { this.port = port }
                return this
            }

             , onrequest: _.make.core.basicsignal()
             , onerror: _.make.core.basicsignal()

            , loadcert: function(certname, certpassword) {
                this.certkey - fs.readFileSync(this.certpath + this.certname + ".key"),
                this.cert = fs.readFileSync(this.certpath + this.certname + ".crt"),
                this.certpassword - this.certpassword
                return this
            }

            , hascertificate: function() {
                return false

                //this.loadcert()
                //return this.certname && this.certpassword
            }


            , start: function() {
                var me = this

                var requesthandler = function (req, res) {
                    var response = _.make.httpresponse(me, req, res)
        
                    if (me.blockrequests) {
                        response.senderror("Server Unavailable", 503)
                        return
                    }
        
                    me.onrequest(response)
                }                

                if (this.hascertificate()) {
                    var options = {
                        key: this.certkey
                        , cert: this.cert
                        , passphrase: this.certpassword
                    }

                    var server = https.createServer(options, requesthandler)

                } else {                    
                    var server = http.createServer(requesthandler)
                }

                server
                    .on("listening", function (result) {
                        var serverinfo = server.address()
                        _.debug("Server " + me.name + " online on " + serverinfo.address + ":" + me.port)
                    })
                    .on("error", function (error) {
                        me.onerror("Error - httpserver.createserver " + error.message)

                        // if (!server.listening) {
                        //     _.timer.waitfor(1000, "retry port binding").ontimer(function () { _.createserver(servername, ip, port, cert, serverhandler) })
                        // }
                    })
                    .on("close", function (result) {
                        _.debug("Server " + me.name + " closed")
                    })
                    

                this.httpserver = server
                server.listen(this.port, this.ip || undefined);
                    

                return this
            }

            , stop: function() {
                this.httpserver.close()
                return this
            }
        }
    })

})







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
