//*************************************************************************************************
// basicdate - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicdate", function (_) {
    _.helper.date = {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        , monthsshort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        , days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        , daysshort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        , daysmin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        , am: ["AM", "PM"]
        , ampm: ["AM", "PM"]
        , ampmLower: ["am", "pm"]
    }

    var helper = _.helper.date

    //Low level function. But actual timing it is better to use async or timer object.
    _.immediate = _.immediate || function () {
        return typeof setImmediate == "function" ? function (next, scope) { return setImmediate(next, scope) } : function (next, scope) { setTimeout(next, 0, scope) }
    }()

    _.now = Date.now || function () {
        return new Date().getTime()
    }

    _.formatdate$ = function (value, format, asutc) {
        if (!_.isdate(value)) {
            value = new Date(value)
        }
        return format.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|d|hh|h|nn|n|ss|iii|ii|i)/gi, function ($1) {
            switch ($1) {
                case "yyyy": return asutc ? value.getUTCFullYear() : value.getFullYear()
                case "mmmm": return helper.months[asutc ? value.getUTCMonth() : value.getMonth()]
                case "mmm": return helper.monthsshort[asutc ? value.getUTCMonth() : value.getMonth()]
                case "mm": return _.padleft$((asutc ? value.getUTCMonth() : value.getMonth()) + 1, "0", 2)
                case "dddd": return helper.days[asutc ? value.getUTCDay() : value.getDay()]
                case "ddd": return helper.daysshort[asutc ? value.getUTCDay() : value.getDay()]
                case "dd": return _.padleft$(asutc ? value.getUTCDate() : value.getDate(), "0", 2)
                case "d": return asutc ? value.getUTCDate() : value.getDate()
                case "hh": return _.padleft$(asutc ? value.getUTCHours() : value.getHours(), "0", 2)
                case "h": return asutc ? value.getUTCHours() : value.getHours()
                case "nn": return _.padleft$(asutc ? value.getUTCMinutes() : value.getMinutes(), "0", 2)
                case "n": return asutc ? value.getUTCMinutes() : value.getMinutes()
                case "ss": return _.padleft$(asutc ? value.getUTCSeconds() : value.getSeconds(), "0", 2)
                case "iii": case "ii": return _.padleft$(asutc ? value.getUTCMilliseconds() : value.getMilliseconds(), "0", 3)
                case "i": return _.padleft$(asutc ? value.getUTCMilliseconds() : value.getMilliseconds(), "0", 3)
            }
        })
    }

    _.formattime$ = function (time, includehour, asutc) {
        var time = _.roundto(time, 1000)

        if ((time > 3600) || includehour) {
            return _.formatdate$(time, "h:nn:ss", asutc)
        } else {
            return _.formatdate$(time, "nn:ss", asutc)
        }
    }
})