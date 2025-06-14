//*****************************************************************************************************************
// promise - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
// Be basic! No capitals, no lambdas, no ; Library functions are preceded by _.
//*****************************************************************************************************************
_.ambient.module("promise", function(_) {

    _.define.object("promise", function(supermodel) {

        this.state = "pending"
        this.value = undefined
        this._queue = []
        this._autostart = true
        this._executor = undefined
        this._timeoutid = undefined

        this.oncancel = _.model.signal()
        this.ondone = _.model.signal()
        this.onfinish = _.model.signal()
        this.onerror = _.model.signal()
        this.onprogress = _.model.signal()

        this.construct = function(executor) {
          if (this._autostart) this.run(executor)
        }

        this.run = function(executor) {
          var me = this
          
          this._executor = executor

            setTimeout(function() {
                try {
                    me._executor(me.resolve, me.reject, me.onprogress)
                } catch (error) {
                    me.reject(error)
                }
            }, 0)
        }

        this.resolve = function(value) {
            if (this.state !== "pending") return
            this.state = "fulfilled"
            this.value = value
            this.ondone(value)
            this._processnext(value, "fulfilled")
        }

        this.reject = function(reason) {
            if (this.state !== "pending") return
            this.state = "rejected"
            this.value = reason
            this.onerror(reason)
            this._processnext(reason, "rejected")
        }

        this.cancel = function() {
            if (this.state !== "pending") return
            this.state = "canceled"
            this._queue = []
            if (this._timeoutid !== undefined) clearTimeout(this._timeoutid)
            this.oncancel()
            this.onfinish()
        }

        this.then = function(onfulfilled, onrejected) {
            if (this.state !== "pending") throw new Error("Cannot add then() after promise is settled")
            this._queue.push(_.model.thenable(this, onfulfilled, onrejected))
            return this
        }

        this.timeout = function(ms) {
            var me = this
            if (this.state !== "pending") return this
            this._timeoutid = setTimeout(function() {
                me.reject(new Error("Timeout after " + ms + "ms"))
            }, ms)
            return this
        }

        this._processnext = function(value, state) {
            var next = this._queue.shift()
            if (!next) {
                this.onfinish(this.value)
                return
            }
            try {
                next.run(value, state)
            } catch (error) {
                this.reject(error)
            }
        }

    })

    _.define.object("thenable", function(supermodel) {
        this.parent = undefined
        this.onfulfilled = undefined
        this.onrejected = undefined

        this.construct = function(parent, onfulfilled, onrejected) {
            if (!(parent instanceof _.model.promise)) throw "invalid parent"

            this.parent = parent
            this.onfulfilled = _.isfunction(onfulfilled) ? onfulfilled : function(value) { return value }
            this.onrejected = _.isfunction(onrejected) ? onrejected : function(error) { throw error }
        }

        this.run = function(value, state) {
            var me = this
            var result
            try {
                result = (state === "fulfilled") ? me.onfulfilled(value) : me.onrejected(value)
            } catch (error) {
                me.parent._processnext(error, "rejected")
                return
            }

            if (_.ispromise(result)) {
                result.then(
                    function(nextvalue) { me.parent._processnext(nextvalue, "fulfilled") },
                    function(nexterror) { me.parent._processnext(nexterror, "rejected") }
                )
            } else if (result instanceof Error) {
                me.parent._processnext(result, "rejected")
            } else {
                me.parent._processnext(result, "fulfilled")
            }
        }
    })
})
