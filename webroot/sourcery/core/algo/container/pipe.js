_.ambient.module("pipe", function(_) {

    _.define.object("pipe", function(supermodel) {
        this.id = 0
        this.barrelindex = 0
        this.action = ""
        this.params = null
        this.progress = 0
        this.errormessage = ""

        this._prev = null
        this._next = null

        this.create = function(parent, id) {
            this._parent = parent
            this.id = id || _.uniqueid()
        }

        this.barrel = function() {
            var me = this
            me.barrelindex++

            var barrel = _.model.barrel(me.id, me.barrelindex)

            barrel.onclose(function() {
                me.receive(barrel)
            })

            barrel.onerror(function() {
                me.receive(barrel)
            })

            this.onbarrel.call(this, barrel)
            return barrel
        }

        this.pipe = function(nextpipe) {
            if (!(nextpipe instanceof _.model.pipe)) { throw "Error: can only pipe into another pipe" }
            if (this._next) { throw "Error: pipe already has next pipe" }

            this._next = nextpipe
            nextpipe._prev = this
            return nextpipe
        }

        this.send = function(data, progress) {
            var barrel = data instanceof _.model.barrel ? data : this.barrel()

            barrel.progress = progress || this.progress || 1
            if (!(data instanceof _.model.barrel)) {
                barrel.close(data)
            }

            this.receive(barrel)
            return this
        }

        this.receive = function(barrel) {
            this.progress = barrel.progress || this.progress

            if (barrel.iserror()) {
                this.errormessage = barrel.error
                this.onerror(this.errormessage)
                this.destroy()
                return
            }

            if (!this.barrelindex || this.progress === 0) {
                var data = barrel.data || {}
                this.action = data.action
                this.params = data.params
                this.progress = 1
                this.onrequest()
            } else {
                this.ondata(barrel.data)
            }

            // route barrel by direction
            if (barrel.direction === 1 && this._next) {
                this._next.receive(barrel)
            } else if (barrel.direction === -1 && this._prev) {
                this._prev.receive(barrel)
            }

            if (barrel.isclose() || this.progress >= 100) {
                this.onclose()
                this.ondestroy()
            }
        }

        this.destroy = function() {
            var barrel = this.barrel()

            if (this._prev && this._next) {
                // middle of chain → unlink
                this._prev._next = this._next
                this._next._prev = this._prev
                this._prev = null
                this._next = null
                this.ondestroy()
            } else if (!this._prev && !this._next) {
                // isolated pipe
                this.ondestroy()
            
            } else if (this._prev) {
                // end of chain → send close backward
                barrel.direction = -1
                barrel.close()
                this._prev.receive(barrel)                

            } else if (this._next) {
                // start of chain → send close forward
                barrel.direction = 1
                barrel.close()
                this._next.receive(barrel)                

            }
        }

        this.onbarrel = _.model.signal()
        this.ondata = _.model.signal()
        this.onrequest = _.model.signal()
        this.onerror = _.model.signal()
        this.onclose = _.model.signal()
        this.ondestroy = _.model.signal()
    })

})
