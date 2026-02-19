//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("widgetwindow", function(_) {
    _.define.model("widgetwindow", function (supermodel) {
        this.uidocument = null
        this.htmleventhandler = null
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
            //todo: this shouldn't be here. No references to html objects, we want to be platform independent
            if (!this.htmleventhandler) {
                this.htmleventhandler = _.model.htmleventhandler()
            }
            this.htmleventhandler.attach(this, uidocument)
            //todo: this should be how we connect uidocument events to our window
//            this.htmleventhandler.onuievent(function(uievent) { me.handleevent(uievent) })
            return this
        }

        this.disconnect = function() {
            //todo: this shouldn't be here. No references to html objects

            if (this.htmleventhandler) {
                this.htmleventhandler.detach()
            }
            this.uidocument = null
            return this
        }

        this.handleevent = function(uievent) {
            //todo: Understand the uievent, and route to widget
        }
    })
})
