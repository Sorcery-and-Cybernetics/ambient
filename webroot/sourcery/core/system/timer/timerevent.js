//*************************************************************************************************
// Timerevent - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("timerevent", function(_) {    
    var toms = function (time) {
        // if (time instanceof _.model.date) {
        //     return time.utc()
        // }

        return (time + 0)
    }    

    _.define.core.object("core.timerevent", function (supermodel) {
        return {
            initialize: function (runimmediate) {
                this._runimmediate = runimmediate
            }
            
            , _value: 0
            , value: function (value) {
                if (value == null) { return this._value }

                if (value != this._value) {
                    this._value = value
                    //this.rebond()
                }
            }            

            , _interval: 0
            , interval: function(value) {
                if (value === undefined) { return this._interval}

                if (this._interval != value) {
                    this._interval = value

                    if (!this.timeend() || (value + _.timer.now <= this.timeend())) {
                        this.value(_.timer.now + value)
                    } else {
                        this.value(this.timeend() - _.timer.now)
                    }
                }
                return this
            }

            , _timeend: 0
            , timeend: function(value) {
                if (value === undefined) { return this._timeend}

                if (this._timeend != value) {
                    this._timeend = value
                }
                return this
            }

            , _runimmediate: false

            , waituntil: function (time) {
                var time = toms(time)

                this.interval(0)
                this.timeend(time)
                this.value(time)
                return this
            }

            , waitfor: function (time) {
                var time = toms(time)

                this.timeend(_.timer.now + time)
                this.interval(0)
                this.value(_.timer.now + time)
                return this
            }

            , pulse: function (interval, duration) {
                var interval = toms(interval)
                var duration = toms(duration)

                this.timeend(duration? _.timer.now + duration: 0)
                this.interval(interval)
                return this
            }

            , cancel: function () {
                this.destroy()
            }

            , fire: function (next) {
                this.waitfor(0)
            }

            // , destroy: function () {
            //     if (this._parent && this._parent.__timers) {
            //         delete this._parent.__timers[this.name()]
            //     }

            //     supermodel.destroy.call(this)
            // }

            // , rebond: function () {
            //     if (this._indexof) {
            //         this._indexof.rebond()
            //     }
            // }

            , debuginfo: function () {
                return this.name() + " - " + (this.value() - _.timer.now) + ", interval: " + this.interval() + " time left: " + (this.timeend()? this.timeend() - _.timer.now: "---")
            }

            , ontimer: _.make.core.basicsignal()
        }
    })


})