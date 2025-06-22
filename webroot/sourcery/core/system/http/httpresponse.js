//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("httpresponse", function (_) {
//todo: cannot send byte data, because of json arrays
//todo: add position properties for manual chunked sending

    var http = require('http');
    var https = require('https');
    var urlutils = require('url');
    var fs = require("fs")
    var zlib = require("zlib")

    _.define.enum("httpresponse", ["destroyed", "destroying", "error", "cancelled", "done", "none", "created", "receiving", "sending", "proxying"], -5)

    _.define.object("httpresponse", function () {
        this.state = 0
        this.states = _.enum.httpresponse

        this.compress = false
        this.timestart = 0

        this.sendbuffer = undefined
        this.httpcode = 200
        this._mimetype = ""

        this.routedef = undefined
        this.params = undefined
        this._cookie = undefined

        this.url = ""
        this.query = ""
        this.path = undefined

        this.sendstream = undefined
        this.timeoutwarningduration = 500
        this.session = undefined

        this.construct = function (server, request, response) {
            var me = this

            this.server = server

            this.timestart = _.now()

            this.state = this.states.created
            this.req = request
            this.res = response
            this._cookie = _.splitcommandline$(request.headers.cookie, ";") || {}

            var url = request.url.substr(1)
            
            var pos = url.indexOf("?")
            if (pos < 0) {
                this.url = url

            } else {
                this.url = url.substring(0, pos)
                this.query = url.substring(pos + 1)

                this.params = _.splitcommandline$(this.query, "&", "=")
            }


            this.path = this.url.split("/")

            //todo:
            // if ((this.path[0] == "product") && (this.path[1] == _.config.productcode)) {
            //     this.path = this.path.slice(2)
            // }

            this.req.on("error", function (error) {
                if (me.state >= me.states.created) {
                    me.senderror(error)
                }
            })

            this.res.on("finish", function () {
                me.destroy()
            })
        }

        this.requestmethod = function () {
            return this.req.method
        }

        this.addheader = function (header, value) {
            if (this.state == this.states.created) {
                this.res.setHeader(header, value)
            }
            return this
        }

        this.cookie = function (name, value) {
            if (value === undefined) { return this._cookie[name] }

            if (this._cookie[name] != value) {
                this._cookie[name] = value

                this.addheader("set-cookie", name + "=" + encodeURIComponent(value))
            }
        }

        this.sessiontoken = function (value) {
            if (value === undefined) { return (this.cookie("sacgoat") || 0) }

            if (value != this.cookie("sacgoat")) {
                this.cookie("sacgoat", value)
            }

            return this
        }
        
        //todo: buffer should be a separate object
        //todo: sendbuffer should always be an array. Merge sendbuffer when sending
        this.write = function (data) {
            var buffertype = _.vartype(this.sendbuffer)
            var datatype = _.vartype(data)

            switch (buffertype) {
                case _.vtnull:
                    switch (datatype) {
                        case _.vtjson:
                        case _.vtarray:
                            this.sendbuffer = data
                            break
                        default:
                            this.sendbuffer = _.cstr(data)
                    }
                    break

                case _.vtjson:
                    this.sendbuffer = [this.sendbuffer]
                    this.sendbuffer.push(data)
                    break

                case _.vtarray:
                    switch (datatype) {
                        case _.vtjson:
                            this.sendbuffer.push(data)
                            break

                        case _.vtarray:
                            this.sendbuffer = this.sendbuffer.concat(data)
                            break

                        default:
                            throw "Error: wrong type added to buffer"
                    }
                    
                    break

                default:
                    this.sendbuffer += _.cstr(data)
            }

            return this
        }

        this.clear = function () {
            this.sendbuffer = undefined
            return this
        }

        this.flush = function () {
            if (!this.sendbuffer) {
                return
            }

            if ((this.state == this.states.created) && (!this._mimetype)) {
                switch (_.vartype(this.sendbuffer)) {
                    case _.vtarray:
                    case _.vtjson:
                        this.mimetype("json")
                        this.compress = this.server.compress
                        break
                    default:
                        this.mimetype("default")
                }
            }

            this.writebuffer()
            return this
        }
        
        this.writebuffer = function () {
            var data = this.sendbuffer
            this.sendbuffer = undefined

            switch (_.vartype(data)) {
                case _.vtarray:
                case _.vtjson:
                    data = JSON.stringify(data)
            }

            if (this.compress) {
                data = zlib.gzipSync(data)
            }

            this.writeheader()
            this.res.write(data)
            this.clear()
        }

        this.end = function (data) {
            if (data) {
                this.write(data)
            }
            try {
                this.flush()
                this.res.end()
                this.state = this.states.destroying
            } catch (err) {
                _.system.warn(this, "end", err)
                this.destroy()
            }
            return this
        }
        
        this.writeheader = function (httpcode) {
            if (this.state != this.states.created) { return }

            var mimetype = this.mimetype()

            this.addheader("content-type", mimetype.contenttype)
            this.addheader("max-age", mimetype.maxage)
                
            this.addheader("Access-Control-Allow-Origin", "*")
            this.addheader('Access-Control-Allow-Headers', 'Content-Type')

            if (this.compress) {
                this.addheader("content-encoding", 'gzip')
            }

            var parsetime = (_.now() - this.timestart)
            this.addheader('x-time', parsetime)

            if (parsetime > this.timeoutwarningduration) {
                // Performance logging can be added here if needed
            }
        
            this.state = this.states.sending
            
            this.httpcode = httpcode || this.httpcode
            this.res.writeHead(this.httpcode)
        }

        this.mimetype = function (mimetype) {
            if (mimetype && this.state == this.states.created) {
                this._mimetype = _.lcase$(mimetype)
            }
            return _.helper.http.getmimetype(this._mimetype) || _.helper.http.getmimetype("default")
        }

        this.senderror = function (errormessage, errcode, params) {
            if (this.state >= this.states.created) {
                this.state = this.states.error

                if (!this._headerSent) {
                    this.res.writeHead(errcode || 404)
                }

                if (_.iserror(errormessage)) {
                    if (errormessage instanceof _.model.error) {   
                        errormessage = errormessage.message                    
                    } else {
                        errormessage = errormessage.message
                    }
                } else if (_.isobject(errormessage)) {
                    errormessage = JSON.stringify(errormessage)
                }

                this.res.end(errormessage)

                _.system.warn(this, "senderror", params||[], errormessage)
                this.destroy()
            } else {
                _.system.warn(this, "senderror.trailing", params||[], errormessage)
            }
        }

        this.senddata = function (data, mimetype) {
            this.state = this.states.sending
            this.mimetype(mimetype)
            this.write(data)
            this.end()
        }

        this.getpostdata = function (next) {
            var me = this
            var request = this.req
            this.state = this.states.receiving

            var contenttype = request.headers["content-type"]
            var mimetype = _.helper.http.getmimetype(_.leftof$(contenttype, "/"))

            request.setEncoding(mimetype.encoding)

            var buffer = _.model.asyncstream()

            request.on("data", function (chunk) {
                buffer.write(chunk)
            })

            request.on("end", function () {
                //me.state = me.states.created

                if (next) {
                    var data = buffer.data
                    request.rawpostdata = data
                    if (mimetype.encoding == "utf-8") {
                        switch (_.left$(data, 1)) {
                            case "{":
                            case "[":
                                data = _.json.parse(data)
                                break
                            default:
                                data = _.splitcommandline$(data)
                        }
                    }
                    request.postdata = data
                    next(null, data)
                }

                buffer.done()
            })

            request.on("error", function (err) {
                if (next) {
                    next(err, null)
                } else {
                    buffer.error(err)
                }
            })

            return next? undefined: buffer
        }

        this.sendfile = function (filename) {
            var me = this

            if (this.state != this.states.created) { throw "Response object cannot send file in current state" }
            filename = filename || this.url

            var fullname = decodeURIComponent(filename)
            var extension = _.path.getextension(fullname)

            var mimetype = this.mimetype(extension)

            if (!mimetype.byteranged) {
                fs.readFile(fullname, function (err, data) {
                    if (err) {
                        return me.senderror(err, 404)
                    }
                    if (me.state < me.states.created) {
                        _.system.warn(me, "sendfile", [filename], "After Read, response object cannot send file in current state")
                        return
                    }
                    me.sendbuffer = data
                    me.end()
                })

            } else {
                //stream
                fs.stat(fullname, function (err, stats) {
                    if (err) {
                        _.system.warn("httpresponse", "sendfile", [filename], "After Stat, cannot read file")

                        if (err.code === 'ENOENT') {
                            return me.senderror("File not found: " + filename, 404)
                        }
                        return me.senderror("Cannot read file: " + filename, 400)
                    }

                    if (me.state < me.states.created) {
                        _.system.warn("httpresponse", "sendfile", [filename], "After Stat, response object cannot send file in current state")
                        return
                    }

                    var range = me.req.headers.range
                    var total = stats.size

                    if (!range) {
                        var start = 0
                        var end = total - 1
                        if (end < 0) { end = 0 }

                        var chunksize = total

                        me.res.writeHead(200, {

                            "Content-Range": "bytes " + start + "-" + end + "/" + total
                            , "Accept-Ranges": "bytes"
                            , "Content-Length": chunksize
                            , "Content-Type": mimetype.contenttype
                            //, "Access-Control-Allow-Origin": "*"
                            //, "Access-Control-Allow-Headers": "Content-Type"
                            , "max-age": mimetype.maxage
                        })

                    } else {
                        var positions = range.replace(/bytes=/, "").split("-")
                        var start = parseInt(positions[0], 10)
                        var end = positions[1] ? parseInt(positions[1], 10) : total - 1

                        var chunksize = (end - start) + 1
                        if (end < 0) { end = 0 }

                        me.res.writeHead(206, {
                            "Content-Range": "bytes " + start + "-" + end + "/" + total
                            , "Accept-Ranges": "bytes"
                            , "Content-Length": chunksize
//                            , "Transfer-Encoding": "chunked"
                            , "Content-Type": mimetype.contenttype
                            //, "Access-Control-Allow-Origin": "*"
                            //, "Access-Control-Allow-Headers": "Content-Type"
                            , "max-age": mimetype.maxage
                        })
                    }



                    var transferred = 0

                    me.sendstream = fs.createReadStream(fullname, { start: start, end: end })
                        .on("open", function () {
                            if (me.state >= me.states.created) {
                                me.sendstream.pipe(me.res)
                            } else {
                                me.senderror("Cannot stream file: " + filename, 400)
                            }
                        }).on("error", function (err) {
                            me.senderror(err)
                        })
                        .on("data", function (data) {
                            transferred += data.length
                        })
                        .on("finish", function () {
                            me.sendstream = undefined
                        })

                })
            }
        }

        //todo: Move to proxy object
        this.handleproxy = function (url) {
            this.state = this.states.proxying

            var me = this
            var path = urlutils.parse(url)

            var options = {
                hostname: path.hostname
                , port: path.port
                , path: path.path
                , method: this.req.method
                , agent: undefined
                , headers: this.req.headers
            }

            var datasize = 0

            var redirect = http.request(options, function (serverresponse) {
                serverresponse.on("data", function (chunk) {
                    me.res.write(chunk, "binary")
                })
                .on("end", function () {
                    me.end("HTTP/1.1 500 External Server End\r\n")
                })
                .on("error", function (err) {
                    me.end("HTTP/1.1 500 " + err.message + "\r\n")
                })

                me.res.writeHead(this.res.statusCode, this.res.headers)
            })

            redirect.on("error", function (err) {
                raiseerror(err)
            })

            this.req.on('data', function (chunk) {
                datasize += chunk.length
                redirect.write(chunk, 'binary');
            })
            .on('error', function (err) {
                me.senderror(err)
                redirect.end()
            })
            .on('end', function () {
                redirect.end();
            })
        }

        this.destroy = function () {
            if (this.state < this.states.created) { return }
            this.state = this.states.destroying

            if (this.sendstream) {
                this.sendstream.destroy()
                this.sendstream = undefined
            }

            this.server = undefined
            this.res = undefined
            this.req = undefined

            this.state = this.states.destroyed
        }

        //todo: add listeners
        //this.ondestroy = _.model.signal()
        //this.onerror = _.model.signal()
        //this.ondone = _.model.signal()
    })
})