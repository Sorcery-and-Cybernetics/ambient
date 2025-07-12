//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("date", function(_) {
    _.define.modelvalue("date", function (supermodel) {    
    //_.months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
    //_.monthsshort = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
    //_.days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    //_.daysshort = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

    var safedate = function (value) {
        if (value == null) { return null }
        if (_.isdate(value)) { return value }

        if (value instanceof _.model.date) { return value.get() }

        if (_.isstring(value)) {
            //because safari doesn't play nice with non-tz times, thinking they are utc instead of local.
            //hack: if the length is 16; xxxx-xx-xxTxx-xx then there is no TZ and thus a local datetime
            //todo: improve proper handling, for way more cases that this.
            if (_.length(value) == 16) {
                return new Date(Number(value.substring(0, 4)), Number(value.substring(5, 7)) - 1, Number(value.substring(8, 10)), Number(value.substring(11, 13)), Number(value.substring(14, 16)))
            } else {
                return new Date(value)
            }
        }

        return new Date(value)
    }

    var floor = function (date, precision) {
        date = new Date(date)
        var U
        if (_.isstring(precision)) { precision = _.enum.datesymbol[precision] || 0 }

        if (precision > 7) {
            date.setFullYear(
                precision >= 6 ? 0 : U
                , precision >= 5 ? 0 : U
                , precision >= 4 ? 1 : U
            )
        }
        date.setHours(
            precision >= 3 ? 0 : U
            , precision >= 2 ? 0 : U
            , precision >= 1 ? 0 : U
            , precision >= 0 ? 0 : U
        )
        return date
    }
    
    this.lang_today = "today"
    this.lang_yesterday = "yesterday"
    this.msday = 24 * 60 * 60 * 1000
    this.mshour = 60 * 60 * 1000
    this.msminute = 60 * 1000
    this.mssecond = 1000

    this.isutc = false

    this.construct = function (value) {
        if (value != null) { this.let(value) }
    }

    //overwriting modelvalue.initial
    this.initial = function (value) {
        if (value === undefined) { return this._initial }

        this._initial = safedate(value)
        return this        
    }

    //overwriting modelvalue.let
    this.let = function (value) {
        if (this._self) { this._self.destroy() }

        value = safedate(value)
        if (value.getTime() == this._value.getTime()) { return this }
        this._value = value

        return this
    }
    
    this.get = function() {
        var self = this.self()
        var value

        if (self) {
            if (self instanceof _.model.model) { return self }
            value = self.value()
        } else {
            value = this._value || this._initial
        }
        //todo: Implement calculated values
        return value        
    }

    this.format$ = function (format, asutc) {
        format = _.lcase$(format)

        var d = this.get()
        if (!d) { return "" }

        switch (format) {
            case "shortdate":
                var today = _.floorto((new Date()).valueOf(), this.msday)
                var yesterday = today - this.msday

                if (d.valueOf() >= today) {
                    format = "hh:nn"
                } else if (d.valueOf() >= yesterday) {
                    return this.lang_yesterday
                } else {
                    format = "dd-mmm-yyyy"
                }
                break

            case "nicedate":
                var daydiff = this.diffday(_.now())

                switch (daydiff) {
                    case 0:
                        return "today"
                    case -1:
                        return "tomorrow"
                    case 1:
                        return "yesterday"
                }
                format = "dd mmm yyyy"
                break

            case "detailtime":
                d = d || _.now()
                format = "hh:nn:ss:iii"
                break
        }

        return _.formatdate$(d, format, _.undef(asutc, this.isutc))
    }

    this.cleartime = function () {
        this.let(new Date().setHours(0, 0, 0, 0))
    }

    this.setnow = function () {
        return this.let(new Date())
    }

    this.setdate = function (year, month, day, asutc) {
        if (asutc) {
            this.let(new Date().setUTCFullYear(year, month - 1, day, 0, 0, 0, 0))
        } else {
            this.let(new Date().setFullYear(year, month - 1, day, 0, 0, 0, 0))
        }
    }

    this.settime = function (hour, minute, second, ms, asutc) {
        if (asutc) {
            this.let(new Date().setUTCHours(hour || 0, minute || 0, second || 0, ms || 0))
        } else {
            this.let(new Date().setHours(hour || 0, minute || 0, second || 0, ms || 0))
        }
    }

    this.year = function (value) { if (value != null) { this.let(this.get().setFullYear(value)); return this }; return this.get().getFullYear() }
    this.month = function (value) { if (value != null) { this.let(this.get().setMonth(value - 1)); return this }; return this.get().getMonth() + 1 }
    this.day = function (value) { if (value != null) { this.let(this.get().setDate(value)); return this  }; return this.get().getDate() }
    this.hour = function (value) { if (value != null) { this.let(this.get().setHours(value)); return this  }; return this.get().getHours() }
    this.minute = function (value) { if (value != null) { this.let(this.get().setMinutes(value)); return this }; return this.get().getMinutes() }
    this.second = function (value) { if (value != null) { this.let(this.get().setSeconds(value)); return this }; return this.get().getSeconds() }
    this.millisecond = function (value) { if (value != null) { this.let(this.get().setMilliseconds(value)); return this }; return this.get().getMilliseconds() }

    this.addyears = function (value) { return this.year(this.year() + _.cint(value)) }
    this.addmonths = function (value) { return this.month(this.month() + _.cint(value)) }
    this.adddays = function (value) { return this.day(this.day() + _.cint(value)) }
    this.addhours = function (value) { return this.hour(this.hour() + _.cint(value)) }
    this.addminutes = function (value) { return this.minute(this.minute() + _.cint(value)) }
    this.addseconds = function (value) { return this.second(this.second() + _.cint(value)) }
    this.addmilliseconds = function (value) { return this.millisecond(this.millisecond() + _.cint(value)) }

    this.diffmonth = function (value, roundUpFractionalMonths, excludeDays) {
        //see: https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript
        //Months will be calculated between start and end dates.
        //Make sure start date is less than end date.
        //But remember if the difference should be negative.
        var startDate = this;
        var endDate = _.model.date().value(value);
        var inverse = false;
        if (startDate.isafter(endDate)) {
            startDate = _.model.date().value(value);
            endDate = this;
            inverse = true;
        }

        //Calculate the differences between the start and end dates
        var yearsDifference = endDate.year() - startDate.year();
        var monthsDifference = endDate.month() - startDate.month();
        var daysDifference = endDate.day() - startDate.day();

        var monthCorrection = 0;
        //If roundUpFractionalMonths is true, check if an extra month needs to be added from rounding up.
        //The difference is done by ceiling (round up), e.g. 3 months and 1 day will be 4 months.
        if (!excludeDays && roundUpFractionalMonths === true && daysDifference > 0) {
            monthCorrection = 1;
        }
        //If the day difference between the 2 months is negative, the last month is not a whole month.
        else if (!excludeDays && roundUpFractionalMonths !== true && daysDifference < 0) {
            monthCorrection = -1;
        }

        return (inverse ? -1 : 1) * (yearsDifference * 12 + monthsDifference + monthCorrection);
    }

    this.diffday = function (value, precise) { return (precise ? (this.get() - safedate(value)) : (floor(safedate(value), 4) - floor(this.get(), 4)) / this.msday) }
    this.diffhour = function (value, precise) { return precise ? ((this.get() - safedate(value)) / this.mshour) : (Math.floor(this.get() / this.mshour) - Math.floor(safedate(value) / this.mshour)) }
    this.diffminute = function (value, precise) { return precise ? ((this.get() - safedate(value)) / this.msminute) : (Math.floor(this.get() / this.msminute) - Math.floor(safedate(value) / this.msminute)) }
    this.diffsecond = function (value, precise) { return precise ? ((this.get() - safedate(value)) / this.mssecond) : (Math.floor(this.get() / this.mssecond) - Math.floor(safedate(value) / this.mssecond)) }
    this.diffms = function (value) { return (this.get() - safedate(value)) }

    //todo: This function should return a daterange
    this.week = function () {
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = _.model.date().value(curr.setDate(first))
        var lastday = _.model.date().value(curr.setDate(last))

        return {
            firstday: firstday
            , lastday: lastday
            , weeknr: null
            , weekyear: null
        }
    }

    this.firstdayofweek = function () {
        return 1 //monday: After a long lunch discussion we decided that monday is the best day to start the week
    }

    //todo: Fix this shit
    this.weeknumber = function (value, asutc) {
        var asutc = asutc || this.isutc
        var datevalue = this.get()

        var onejan = new Date(asutc ? datevalue.getUTCFullYear() : datevalue.getFullYear(), 0, 1)

        if (value != null) {
            return Math.ceil((((datevalue - onejan) / 86400000) + onejan.getDay() + 1) / 7)
        } else {
            return this.let(onejan).week(value)
        }
    }

    this.utc = function (value) {
        if (value == null) {
            return this.get().getTime()
        } 

        return this.let(value)
    }

    //Todo: discuss - what to do when date == 0
    this.isafter = function (date) {
        return (this.diffsecond(date || 0) >= 0)
    }

    this.isbefore = function (date) {
        return (this.diffsecond(date || 0) < 0)
    }

    this.floor = function (precision) {
        var U
        if (_.isstring(precision)) { precision = _.enum.datesymbol[precision] || 0 }

        if (precision > 3) {
            this.get().setFullYear(
                precision >= 6 ? 0 : U
                , precision >= 5 ? 0 : U
                , precision >= 4 ? 1 : U
            )
        }
        this.get().setHours(
            precision >= 3 ? 0 : U
            , precision >= 2 ? 0 : U
            , precision >= 1 ? 0 : U
            , precision >= 0 ? 0 : U
        )
        return this.updatedirty("change", "value")
    }
})


    //todo:
// _.define.date("utcdate", function (supermodel) {
//     return {
//         isutc: true
//     }
// })

// _.define.kind("daterange", function (supermodel) {
//     return {
//         from: _.property()
//         , till: _.property()

//         , set: function (from, till) {
//             if (from) { this.from(_.make.date(from)) }
//             if (till) { this.till(_.make.date(till)) }
//         }
//     }
// })    
})