//todo: Cache data, use read to get data?
//todo: remove dependency of dock

//todo: Special stream. Specialized in transferring barrels. Maybe a wagon / cart is a better name here. 

//todo: do not transfer barrels. Barrels should be the an entity before and/or after a stream. Barrels no data type, pipes just transfer.
//todo: repair: send and receive functions. Should be one, otherwise chaining is not possible.
//todo: see if pipe can be made compatible with node.js pipes.

_.define.kind("pipe", function (supermodel) {
    return {
        id: 0
//        , dock: null
        , barrelindex: 0

        , action: ""
        , params: 0
        , progress: 0
        , errormessage: ""

        , create: function (parent, id) {
            this._parent = parent

            this.id = id || _.uniqueid()
        }

        , open: function (action, params) {
            if (this.barrelindex) { throw "error" }

            this.progress = 0
            this.action = action
            this.params = params

            var barrel = this.barrel()

            var data = {
                action: this.action
                , params: this.params
            }

            barrel.close(data)

            return this
        }

        , barrel: function () {
            var me = this

            me.barrelindex++

            var barrel = _.make.barrel(me.id, me.barrelindex)

            barrel.onclose(function () {
                me.onbarrel(barrel)
            })

            return barrel
        }

        , send: function (data, progress) {
            var me = this

            this.progress = progress || this.progress || 1

            if (data instanceof _.kind.pipe) {
                data.onbarrel(function(barrel) { 
                    me.send(barrel, data.progress)
                })

                data.onclose(function (lastdata) {
                    if (lastdata == this) { lastdata = null }
                    me.close(lastdata)
                })

                data.onerror(function() {
                    me.onerror(me.error)
                })

            //} else if (data instanceof _.kind.barrel) {
            //    var barrel = this.barrel()

            //    barrel.progress = this.progress
            //    barrel.close(data.data)

            //    if (this.progress >= 100) {
            //        this.onclose()
            //        this.destroy()

            //    } else if (this.progress == -1) {
            //        this.onerror(data)
            //        this.destroy()
            //    }

            } else {
                if (data instanceof _.kind.barrel) {
                    data = data.data
                }

                var barrel = this.barrel()
                barrel.progress = this.progress
                barrel.close(data)

                if (this.progress >= 100) {
                    this.onclose()
                    this.destroy()

                } else if (this.progress == -1) {
                    this.onerror(data)
                    this.destroy()
                }
            }

            return this
        }

        , receive: function (barrel) {
            var data = barrel.data

            this.progress = barrel.progress || this.progress

            switch (this.progress) {
                case -1:
                    this.errormessage = data
                    this.onerror(data)
                    this.destroy()
                    break

                case 0:
                    this.action = data.action
                    this.params = data.params
                    this.progress = 1
                    this.onrequest()

                    break

                default:
                    this.ondata(data)

                    if (this.progress >= 100) {
                        this.onclose()
                        this.destroy()
                    }
            }

            var data = barrel.data
        }

        , close: function (data) {
            this.send(data, 100)

            //this.onclose()
            //this.destroy()
        }

        , error: function (description) {
            this.send(description, -1)
            //this.onclose()
            //this.destroy()
        }

        , onbarrel: _.signal() //Parent should implement this event. 
        , ondata: _.signal()
        , onrequest: _.signal()
        , onerror: _.signal()
        , onclose: _.signal()
        , ondestroy: _.signal()
    }
})

