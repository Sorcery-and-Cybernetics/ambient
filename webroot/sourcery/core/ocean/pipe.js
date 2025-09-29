//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, no semicolons, no let/const, no underscores (except privates), or 3rd-party libs; 1-based lists; {} for if blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("pipe", function(_) {

    _.define.object("pipe", function(supermodel) {
        this.id = 0
        this.barrelindex = 0
        this.action = ""
        this.param = null
        this.progress = 0

        this._prev = null
        this._next = null

        this._isclose = false

        this.construct = function(action, param) {
            this.action = action || ""
            this.param = param || null
        }

        this.assignto = function(parent, id) {
            this._parent = parent
            this.id = id || _.uniqueid()
        }

        this.send = function(data, progress) {
            if (this.isclose()) { throw "Error: Pipe already closed" }   

            if (data instanceof _.model.pipe) {
                if (this._prev) { throw "Error: Pipe already connected" }
                this._prev = data
                data._next = this
                return this
            }

            if (data instanceof _.model.barrel) { 
                if (!data.iserror()) {

                    if (data.id == 1) {
                        this.action = data.action
                        this.param = data.param
                    }
                    this.progress = data.progress
                    this.barrelindex = data.id
                }

            } else {
                if (this._prev) { throw "Error: Cannot insert data into a chained pipe."}
                this.barrelindex++

                var data = _.model.barrel(data, progress || this.progress).assignto(this.id, this.barrelindex)

                if (this.barrelindex == 1) {
                    data.action = this.action
                    data.param = this.param
                    data.progress = 1
                } else {
                    data.progress = progress || this.progress                    
                }                
            }

            this._send(data)
            return this
        }

        this._send = function(barrel) {
            if (this._next) { 
                barrel.direction = 1
                this._next.send(barrel)

            } else {

                if (barrel.iserror()) {
                    this.onerror(barrel.error) //event
                    this.fail(barrel.error)  // returning error through the chain

                } else {
                    this.onsend(barrel)

                    if (barrel.isclose()) { //auto close when a barrel is sent with progress 100.
                        this.close()
                    }                    
                }
            }
        }

        this.reply = function(data, progress) {
            if (data instanceof _.model.pipe) {
               if (this._next) { throw "Error: Pipe already connected" }

               this._next = data
               data._prev = this
               return this
            }


            if (data instanceof _.model.barrel) {
                this.progress = data.progress

            } else {
                if (progress) { this.progress = progress }
                data = _.model.barrel(data, this.progress).assignto(this.id, this.barrelindex)
            }
            
            this._reply(data)

            if (data.isclose()) {
                this._isclose = true
                this.onclose()
                this.destroy()
            }            

            return this
        }

        this._reply = function(barrel) {

            if (this._prev) { 
                barrel.direction = -1
                this._prev.reply(barrel)

            } else {
                if (barrel.iserror()) {
                    this.onerror(barrel.error)
                } else {
                    this.onreply(barrel)
                }
            }
        }

        this.fail = function(message) {
            if (this.isclose()) { return this }

            this._isclose = true

            var barrel = _.model.barrel(null, this.progress).assignto(this.id, this.barrelindex)
            barrel.error = message || "Error: Unknown"

            // send error downstream if next exists, otherwise reply upstream
            return this._next? this._send(barrel) : this._reply(barrel)
        }

        this.isclose = function() { return this._isclose }

        this.close = function() {
            if (this.isclose()) { return this }
            
            this._isclose = true
            var barrel = _.model.barrel(null, 100).assignto(this.id, this.barrelindex)

            // send error downstream if next exists, otherwise reply upstream
            return this._next? this._send(barrel) : this._reply(barrel)
        }

        this.destroy = function() {
            if (this._prev) { this._prev._next = this._next }
            if (this._next) { this._next._prev = this._prev }

            this._prev = null
            this._next = null            

            return supermodel.destroy.call(this)            
        }

        this.onsend = _.model.signal()
        this.onreply = _.model.signal()

        this.onerror = _.model.signal()
        this.onclose = _.model.signal()
    })

})

.ontest("pipe", function(_) { 
    var pipe1 = _.model.pipe()
        .onsend(function(barrel) {
            _.debug(this.action + " " + this.param.param + ": " + barrel.data)
            this.reply(barrel.data + " to you too!", 100)
        })
        .onreply(function() {
            _.debug("Reply received")
        })   


    var pipe2 = _.model.pipe("test", { "param": "Pipe 1" })
        .onreply(function(barrel) {
            _.debug(this.action + " " + this.param.param + ": " + barrel.data)
        })

    pipe1.send(pipe2)

    pipe2.send("Hello World 1")

    var isclosed1 = pipe1.isclose()
    var isclosed2 = pipe2.isclose()
})
