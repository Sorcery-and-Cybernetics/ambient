//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("timer", function(_) {  
    _.define.globalobject("timer", function (supermodel) {
        var performancetimer = null
    
        if (false) {//(typeof window != 'undefined') && window.requestAnimationFrame) {
            performancetimer = window["requestAnimationFrame"]
        } else {
            performancetimer = function (next) { setTimeout(next, 16.666) }
        }
    
        this.now = 0
        this.second = -1
        this.minute = -1
        this.hour = -1
        this.day = -1
//        this.week = 0
        this.month = -1
//        this.year = 0

        this.msday = 24 * 60 * 60 * 1000
        this.mshour = 60 * 60 * 1000
        this.msminute = 60000
        this.mssecond = 1000

        this.timers = null

        this.datestring = ""
        this.timestring = ""
        this.datetimestring = ""

        this.utcdatestring = ""
        this.utctimestring = ""
        this.utcdatetimestring = ""

        this.prevdatestring = ""
        this.prevutcdatestring = ""

        this.construct = function (scope, initial) {
            var me = this

            me._parent = scope
            me.now = _.now()

            me.timers = _.model.treesortlist(this)
            me.render()
        }

        this.render = function () {
            var me = this

            function renderloop() {
                if (me._evolution < 0) { return }

                var current = new Date()
                var now = current.getTime()
                var date

                me.now = now

                //Fire animation timer
                me.onpulse()

                //Fire timers
                var updatelist = []

                me.timers.foreachitem(function (timer) {
                    if (timer.value() > now) { return _.done }

                    updatelist.push(timer)
                })

                _.foreach(updatelist, function (timer) {
                    timer.ontimer()

                    if (timer.interval() && (!timer.timeend() || (timer.timeend() > now))) {
                        timer.value(now + timer.interval())
                    } else if (timer.value() <= now) {
                        timer.destroy()
                    }
                })

                //Fire schedules
                var timeframe = now

                timeframe = _.math.floorto(timeframe / 1000, 1)
                var second = timeframe % 60
                if (second != me.second) {
                    me.second = second

                    me.timestring = _.formatdate$(current, "hh:nn:ss")
                    me.datetimestring = me.datestring + "T" + me.timestring

                    // me.utctimestring = _.formatdatetime$(current, "hh:nn:ss")
                    // me.utcdatetimestring = me.utcdatestring + "T" + + "T" + me.utctimestring

                    me.onsecond()

                    timeframe = _.math.floorto(timeframe / 60, 1)
                    var minute = timeframe % 60
                    if (minute != me.minute) {
                        me.minute = minute
                        me.onminute()

                        timeframe = _.math.floorto(timeframe / 60, 1)
                        var hour = timeframe % 24
                        if (hour != me.hour) {
                            me.hour = hour
                            me.onhour()

                            timeframe = _.math.floorto(timeframe / 24, 1)

                            var day = current.getDay()
                            if (day != me.day) {
                                me.day = day

                                me.prevdatestring = me.datestring

                                me.datestring = _.formatdate$(current, "yyyy-mm-dd")
                                me.datetimestring = me.datestring + "T" + me.timestring

                                // me.prevutcdatestring = me.utcdatestring

                                // me.utcdatestring = _.formatdate$(current, "yyyy-mm-dd", true)
                                // me.utcdatetimestring = me.utcdatestring + "T" + me.utctimestring

                                me.onday()

                                var month = current.getMonth()
                                if (month != me.month) {
                                    me.month = month
                                    me.onmonth()
                                }
                            }
                        }
                    }
                }

                performancetimer(renderloop)
            }

            renderloop()
        }

        this.gettimer = function (parent, name) {
            var timer =  _.model.timerevent(parent, name)
            this.timers.push(timer)
            return timer
        }

        this.waituntil = function (time, name) {
            var timerevent = _.model.timerevent(null, name)
            timerevent.waituntil(time)
            this.timers.push(timerevent)
            return timerevent
        }

        this.waitfor = function (time, name) {
            var timerevent = _.model.timerevent(null, name, immediate)
            timerevent.waitfor(time)
            this.timers.push(timerevent)
            return timerevent
        }

        this.pulse = function (interval, duration, name) {
            var timerevent = _.model.timerevent(null, name)
            timerevent.pulse(interval, duration)
            this.timers.push(timerevent)
            return timerevent
        }

        this.destroy = function () {
            this.timers.destroy()
            supermodel.destroy.call(this)
        }

        this.onpulse = _.model.signal()
        this.onsecond = _.model.signal()
        this.onminute = _.model.signal()
        this.onhour = _.model.signal()
        this.onday = _.model.signal()
        this.onweek = _.model.signal()
        this.onmonth = _.model.signal()
    })   
})
