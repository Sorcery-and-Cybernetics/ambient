//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("uieventhandler", function(_) {
    _.define.object("uieventhandler", function() {
        this.widgetwindow = null
        this.uidocument = null

        this.construct = function(widgetwindow, uidocument) {
            this.attach(widgetwindow, uidocument)
        }

        this.attach = function(widgetwindow, uidocument) {
            this.widgetwindow = widgetwindow || null
            this.uidocument = uidocument || (widgetwindow ? widgetwindow.uidocument : null)

            if (!this.uidocument) { return this }

            var me = this
            this.uidocument.onuievent(function(uievent) {
                me.handleuievent(uievent)
            })

            return this
        }

        this.detach = function() {
            if (this.uidocument) {
                this.uidocument.onuievent(_.noop)
            }

            this.uidocument = null
            this.widgetwindow = null
            return this
        }

        this.findtargetwidget = function(uievent) {
            if (!this.uidocument || !uievent) { return null }
            if (!uievent.targetuid) { return null }

            var uielement = this.uidocument.finduielement(uievent.targetuid)
            return uielement ? uielement.widget : null
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

        this.handleuievent = function(uievent) {
            var widget = this.findtargetwidget(uievent)
            if (!widget) { return this }

            this.bubbleevent(widget, uievent)
            return this
        }
    })
})
