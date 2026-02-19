//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("widgetwindow", function(_) {
    _.define.model("widgetwindow", function (supermodel) {
        this.uidocument = null
        this._onevent = null
        this._dirty = true

        _.constructbehavior = _.behavior(function() {
            this.construct = function() {
                supermodel.create.call(this)
            }

            this.destroy = function() {
                this.disconnect()
                supermodel.destroy.call(this)
            }

            this.assign = function(widget, orderindex, relative) {
                this.child.add(widget, orderindex, relative)
            }
        })

        this.setdirty = function() {
            this._dirty = true
        }

        this.connect = function(uidocument) {
            var me = this

            this.uidocument = uidocument
            this._onevent = function(uievent) {
                me.handleevent(uievent)
            }
            this.uidocument.onuievent(this._onevent)
            return this
        }

        this.disconnect = function() {
            if (this.uidocument && this._onevent) {
                this.uidocument.onuievent(_.noop)
            }

            this._onevent = null
            this.uidocument = null
            return this
        }

        this.findtargetwidget = function(uievent) {
            if (!this.uidocument || !uievent) { return null }
            if (!uievent.targetuid) { return null }

            var htmlelement = this.uidocument.findhtmlelement(uievent.targetuid)
            return htmlelement ? htmlelement.widget : null
        }

        this.acceptsevent = function(widget, uievent) {
            if (!widget || !uievent) { return false }
            if (!uievent.behaviortype) { return true }
            if (!widget.behavior) { return true }
            return !!(widget.behavior & uievent.behaviortype)
        }

        this.raisetowidget = function(widget, uievent) {
            if (!widget || !uievent) { return false }
            if (!this.acceptsevent(widget, uievent)) { return false }

            var eventname = uievent.name ? uievent.name() : uievent._name
            var handlername = eventname ? "on" + eventname : ""
            var handled = false

            if (_.isfunction(widget.onuievent)) {
                widget.onuievent(uievent)
                handled = true
            }

            if (handlername && _.isfunction(widget[handlername])) {
                widget[handlername](uievent)
                handled = true
            }

            return handled
        }

        this.bubbleevent = function(widget, uievent) {
            var cursor = widget

            while (cursor) {
                this.raisetowidget(cursor, uievent)
                cursor = cursor.parent ? cursor.parent() : null
            }
        }

        this.handleevent = function(uievent) {
            var widget = this.findtargetwidget(uievent)
            if (!widget) { return this }

            this.bubbleevent(widget, uievent)
            return this
        }
    })
})
