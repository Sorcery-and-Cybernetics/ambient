//*************************************************************************************************
// Timer - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("timer", function(_) {  
    _.define.core.globalobject("core.timer", function (supermodel) {
        var performancetimer = null
    
        if (false) {//(typeof window != 'undefined') && window.requestAnimationFrame) {
            performancetimer = window["requestAnimationFrame"]
        } else {
            performancetimer = function (next) { setTimeout(next, 16.666) }
        }
    
        return {
            now: 0
            , second: -1
            , minute: -1
            , hour: -1
            , day: -1
    //        , week: 0
            , month: -1
    //        , year: 0
    
            , msday: 24 * 60 * 60 * 1000
            , mshour: 60 * 60 * 1000
            , msminute: 60000
            , mssecond: 1000
    
            , timers: null
    
            , datestring: ""
            , timestring: ""
            , datetimestring: ""

            , utcdatestring: ""
            , utctimestring: ""
            , utcdatetimestring: ""

            , prevdatestring: ""
            , prevutcdatestring: ""
    
            , initialize: function (scope, initial) {
                var me = this
    
                me._parent = scope
                me.now = _.now()

                me.timers = _.make.core.treesortlist(this)
                me.render()
            }
    
            , render: function () {
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
    
                            timeframe = _.math.floorto(timeframe / 60, 1);
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
    
            , gettimer: function (parent, name) {
                var timer =  _.make.core.timerevent(parent, name)
                this.timers.push(timer)
                return timer
            }
    
            , waituntil: function (time, name) {
                var timerevent = _.make.core.timerevent(null, name)
                timerevent.waituntil(time)
                this.timers.push(timerevent)
                return timerevent
            }
    
            , waitfor: function (time, name) {
                var timerevent = _.make.core.timerevent(null, name, immediate)
                timerevent.waitfor(time)
                this.timers.push(timerevent)
                return timerevent
            }
    
            , pulse: function (interval, duration, name) {
                var timerevent = _.make.core.timerevent(null, name)
                timerevent.pulse(interval, duration)
                this.timers.push(timerevent)
                return timerevent
            }
    
            , destroy: function () {
                this.timers.destroy()
                supermodel.destroy.call(this)
            }
    
            , onpulse: _.make.core.signal()
            , onsecond: _.make.core.signal()
            , onminute: _.make.core.signal()
            , onhour: _.make.core.signal()
            , onday: _.make.core.signal()
            , onweek: _.make.core.signal()
            , onmonth: _.make.core.signal()
        }
    })   
})
