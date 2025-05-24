//*************************************************************************************************
// Timerevent - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("timerevent", function(_) {    
    var toms = function (time) {
        // if (time instanceof _.model.date) {
        //     return time.utc()
        // }

        return (time + 0)
    }    

    _.define.object("timerevent", function (supermodel) {
        this.construct = function (runimmediate) {
            this._runimmediate = runimmediate
        };
        
        this._value = 0;
        this.value = function (value) {
            if (value == null) { return this._value; }

            if (value != this._value) {
                this._value = value;
                //this.rebond()
            }
        };            

        this._interval = 0;
        this.interval = function(value) {
            if (value === undefined) { return this._interval; }

            if (this._interval != value) {
                this._interval = value;

                if (!this.timeend() || (value + _.timer.now <= this.timeend())) {
                    this.value(_.timer.now + value);
                } else {
                    this.value(this.timeend() - _.timer.now);
                }
            }
            return this;
        };

        this._timeend = 0;
        this.timeend = function(value) {
            if (value === undefined) { return this._timeend; }

            if (this._timeend != value) {
                this._timeend = value;
            }
            return this;
        };

        this._runimmediate = false;

        this.waituntil = function (time) {
            var time = toms(time);

            this.interval(0);
            this.timeend(time);
            this.value(time);
            return this;
        };

        this.waitfor = function (time) {
            var time = toms(time);

            this.timeend(_.timer.now + time);
            this.interval(0);
            this.value(_.timer.now + time);
            return this;
        };

        this.pulse = function (interval, duration) {
            var interval = toms(interval);
            var duration = toms(duration);

            this.timeend(duration? _.timer.now + duration: 0);
            this.interval(interval);
            return this;
        };

        this.cancel = function () {
            this.destroy();
        };

        this.fire = function (next) {
            this.waitfor(0);
        };

        // this.destroy = function () {
        //     if (this._parent && this._parent._timers) {
        //         delete this._parent._timers[this.name()]
        //     }

        //     supermodel.destroy.call(this)
        // };

        // this.rebond = function () {
        //     if (this._indexof) {
        //         this._indexof.rebond()
        //     }
        // };

        this.debuginfo = function () {
            return this.name() + " - " + (this.value() - _.timer.now) + ", interval: " + this.interval() + " time left: " + (this.timeend()? this.timeend() - _.timer.now: "---");
        };

        this.ontimer = _.model.basicsignal();
    });

})