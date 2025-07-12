//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("httprequest", function (_) {

//todo: create request object
//todo: make response object more like asp response

var http = require('http');
var https = require('https');
var urlutils = require('url');
var buffer = require('buffer');


        // _.basicauth = function (username, password){
        //     var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        //     return { 'authorization': auth}
        // }

        // _.oauth = function (token){
        //     var auth = 'Bearer ' + token;
        //     return { 'authorization': auth}
        // }
        // _.oauthheaders = function (message) {
        //     var auth = 'OAuth ' + _.json.toargumentstring(message, ",")
        //     return { 'authorization': auth }
        // }

    _.define.enum("httprequest", ["destroyed", "destroying", "ended", "cancelled", "error", "none", "created", "sending", "receiving"], -5)

    _.define.object("httprequest", function () {
        this.state = 0
        this.states = _.enum.httprequest

        this.timestart = 0
        this.method = null
        this.url = null
        this.params = null
        this.headers = null

        this.construct = function(method, url, params, headers) {
            var me = this;

            this.state = this.states.created

            var buffer = ""
            var postdata = null
            var path = "/"
            var ishttps = _.left$(url, 5) == "https"

            switch (_.lcase$(method)) {
                case "get":
                    path = _.cstr(params) || "/"
                    break

                case "post":
                    if (_.isobject(params)) {
                        postdata = JSON.stringify(params)

                        headers = _.json.combine(headers, {
                            "content-type": "application/json"
                            , "content-length": postdata.length
                            , "charset": "utf-8"
                        })

                    } else if (_.isstring(params) && _.startswith$(params, "<?xml")) {
                        postdata = params

                        headers = _.json.combine(headers, {
                            "content-type": " application/xml"
                            , "content-length": postdata.length
                            , "charset": "utf-8"
                        })
                        
                    } else if (_.isstring(params)) {
                        postdata = params

                        headers = _.json.combine(headers, {
                            "content-type": " text/plain"
                            , "content-length": postdata.length
                            , "charset": "utf-8"
                        })

                    }
            }

            var uri = urlutils.parse(url)

            var options = {
                hostname: uri.hostname
                , port: uri.port
                , path: uri.path
                , method: method
                , headers: headers
                , agent: null
            }

            
            var httptransport = ishttps ? https : http

            var request = httptransport.request(options, function (response) {
                var mimetype = _.helper.http.getmimetype(_.leftof$(response.headers["content-type"], ";"))

                me.state = me.states.created

                // if (encoding) {
                //     request.setEncoding(encoding)

                // } else if (ctvalues[0]) {
                //     var mimetype = _.helper.http.contenttype(ctvalues[0])
                //     request.setEncoding(mimetype.encoding)
                // }
                
                var body = []

                response.on("data", function (chunk) {
                    body.push(chunk)
                })

                response.on("end", function () {
                    responsedata = buffer.concat(body)

                    if (mimetype.encoding == "utf-8") {
                        responsedata = responsedata.toString()
                    }

                    var responsedata

                    switch (mimetype.type) {
                        case "json":
                            try {
                                responsedata = JSON.parse(responsedata.toString());
                            } catch (err) {
                                me.onerror("Error - Httprequest.construct - Error parsing JSON response: " + err);
                                return;
                            }
                    }

                    me.onresponse(responsedata)
                })


                response.on("error", function (err) {
                    me.state = this.states.error
                    me.onerror(err)
                })

                return buffer
            })

            request.on("error", function (err) {
                next(err)
            })

            if (postdata) {
                request.write(postdata)
            }

            request.end()
        }

        this.onresponse = _.model.basicsignal()
        this.onerror = _.model.basicsignal()
    })

    _.http = {        
        "get": function (url, params, next) {
            return _.model.httprequest("get", url, params, null, next)
        }
        , "post": function (url, params, next) {
            return _.model.httprequest("post", url, params, null, next)
        }
    }    
})    
