//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("htmleventhandler", function(_) {
    _.define.object("htmleventhandler", function() {
        this.widgetwindow = null
        this.htmldocument = null

        this.construct = function(widgetwindow, htmldocument) {
            this.attach(widgetwindow, htmldocument)
        }

        this.attach = function(widgetwindow, htmldocument) {
            this.widgetwindow = widgetwindow || null
            this.htmldocument = htmldocument || (widgetwindow ? widgetwindow.htmldocument : null)

            if (!this.htmldocument) { return this }

            var me = this
            this.htmldocument.onuievent(function(htmlevent) {
                me.handlehtmlevent(htmlevent)
            })

            return this
        }

        this.detach = function() {
            if (this.htmldocument) {
                this.htmldocument.onuievent(_.noop)
            }

            this.htmldocument = null
            this.widgetwindow = null
            return this
        }

        this.findtargetwidget = function(htmlevent) {
            if (!this.htmldocument || !htmlevent) { return null }
            if (!htmlevent.targetuid) { return null }

            var htmlelement = this.htmldocument.findhtmlelement(htmlevent.targetuid)
            return htmlelement ? htmlelement.widget : null
        }

        this.acceptsevent = function(widget, htmlevent) {
            if (!widget || !htmlevent) { return false }
            if (!htmlevent.behaviortype) { return true }
            if (!widget.behavior) { return true }
            return !!(widget.behavior & htmlevent.behaviortype)
        }

        this.raisetowidget = function(widget, htmlevent) {
            if (!widget || !htmlevent) { return false }
            if (!this.acceptsevent(widget, htmlevent)) { return false }

            var eventname = htmlevent.name ? htmlevent.name() : htmlevent._name
            var handlername = eventname ? "on" + eventname : ""
            var handled = false

            if (_.isfunction(widget.onuievent)) {
                widget.onuievent(htmlevent)
                handled = true
            }

            if (handlername && _.isfunction(widget[handlername])) {
                widget[handlername](htmlevent)
                handled = true
            }

            return handled
        }

        this.bubbleevent = function(widget, htmlevent) {
            var cursor = widget

            while (cursor) {
                this.raisetowidget(cursor, htmlevent)
                cursor = cursor.parent ? cursor.parent() : null
            }
        }

        this.handlehtmlevent = function(htmlevent) {
            var widget = this.findtargetwidget(htmlevent)
            if (!widget) { return this }

            this.bubbleevent(widget, htmlevent)
            return this
        }
    })
})
