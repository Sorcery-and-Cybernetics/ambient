//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("domdocument", function(_) {
    _.define.enum("dom", ["lastchild", "firstchild", "afterelement", "beforeelement", "body"], 0)

    _.cunit = function (coord, units) {
        units = units || "px"
        if ((coord == null) || (coord == "")) { return coord }
        var result = _.cstr(coord)
        var length = result.length

        if (length > 0) {
            var charcode = result.charCodeAt(length - 1);
            if ((charcode >= 48) && (charcode <= 57)) { result += units }
        }
        return result
    }    

    _.define.globalobject("domdocument", function (supermodel) {
        this.istouch = ("createTouch" in document)
        this.lastmousebutton = 0

        this.lasttouchtime = 0
        this.lastmousetime = 0
        this.eventhistory = null

        this.elements = null
        this.body = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function() {
                this.elements = {}
                this.eventhistory = {}

                var me = this

                if (document.body) {
                    me.body = _.model.dombody(document.body)
//                    this.observemutations()
                    this.observeevents()                    
                } else {
                    document.addEventListener('DOMContentLoaded', function() {
                        me.body = _.model.dombody(document.body)
//                        this.observemutations()
                        this.observeevents()                        
                    })
                }                
            }

            this.destroy = function() {
                this.unobservemutations()
                this.unobserveevents()
            }
        })

        this.pagebehavior = _.behavior(function() {
            this.orientation = function () { return (this.pagewidth() >= (this.pageheight())) ? "landscape" : "portrait" }

            this.pageleft = function() { return window.scrollX }
            this.pagetop = function() { return window.scrollY }
            this.pagewidth = function() { return window.innerWidth }
            this.pageheight = function() { return window.innerHeight }

            this.devicepixels = function () { return window.devicePixelRatio || 1 }

            this.scrolleft = function (value) { 
                if (value === undefined) { return window.pageXOffset || document.documentElement.scrollLeft }            
                window.scrollTo(value, this.scroltop())
                return this
            }

            this.scroltop = function (value) { 
                if (value === undefined) { return window.pageYOffset || document.documentElement.scrollTop } 
                window.scrollTo(this.scrolleft(), value) 
                return this
            }

            this.scrolwidth = function () { return document.documentElement.scrollWidth }
            this.scrolheight = function () { return document.documentElement.scrollHeight }

            this.page = function () { return document.body }
        })

        this.elementbehavior = _.behavior(function() {
            this.finddomelement = function(domelement) {
                elementid = (_.isnumber(domelement)? domelement: domelement.uid())

                return this.domelements[elementid]
            }

            this.registerdomelement = function(domelement) {
                if (!domelement) { throw "error" }

                var uid = domelement.uid()
                if (!uid) { throw "error" }

                this.domelements[uid] = domelement
                return this
            }

            this.unregisterdomelement = function (domelement) {
                domelement = this.finddomelement(domelement)
                if (!domelement) { throw "error" }

                delete this.domelements[domelement.uid()]

                return this
            }

            this.createelement = function (tag, tagtype, namespace) {
                if (_.iselement(tag)) {
                    var element = tag
                } else {
                    if (namespace) {
                        var element = document.createElementNS(namespace, tag)
                    } else {
                        var element = document.createElement(tag)
                    }
                    if (tagtype) { this.attribute(element, "type", tagtype) }                
                }
                return element            
            }

            this.appendelement = function (relative, element, appendmode) {
                if (!relative) { throw "error" }

                relative = relative || document.body
                appendmode = appendmode || _.enum.dom.lastchild

                switch (appendmode) {
                    case _.enum.dom.lastchild:
                        this.appendlastchild(relative, element)
                        break
                    case _.enum.dom.firstchild:
                        this.appendfirstchild(relative, element)
                        break
                    case _.enum.dom.afterelement:
                        if (relative == document.body) { throw "error" }
                        this.appendafter(relative, element)
                        break
                    case _.enum.dom.beforeelement:
                        if (relative == document.body) { throw "error" }
                        this.appendbefore(relative, element)
                        break
                }

                return this
            }

            this.appendlastchild = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.lastchild) }
            this.appendfirstchild = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.firstchild) }
            this.appendafter = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.afterelement) }
            this.appendbefore = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.beforeelement) }

            this.removeelement = function (element) {
                if (!element) { _.system.warn("Element doesn't exist") }
                element.parentNode.removeChild(element)

                return this
            } 
        })

        this.observemutations = function() {
            var me = this

            this.observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.removedNodes.forEach(function(node) {
                        var uid = node._uid

                        var element = me.elements[uid]
                        if (element) { 
                            element.destroy()
                            delete me.elements[uid] 
                        }
                    })
                })
            })

            this.observer.observe(document.body, { childList: true, subtree: true })            
        }

        this.unobservemutations = function() {
            this.observer.disconnect()
            this.observer = null
        }
                
        var bodyeventhandler = function(event) {
            if (me.body) {
                me.body.handledomevent(event)
            }
        }

        this.eventbehavior = _.behavior(function() {
            this.eventconfig = [
                { name: "keydown", target:  "body",  execute: bodyeventhandler }
                , { name: "keyup", target:  "body",  execute: bodyeventhandler }
                , { name: "selectstart", target:  "body",  execute: bodyeventhandler }
                , { name: "input", target:  "body",  execute: bodyeventhandler }
                , { name: "focus", target:  "body",  execute: bodyeventhandler }
                , { name: "click", target:  "body",  execute: bodyeventhandler }
                , { name: "change", target:  "body",  execute: bodyeventhandler }

                , { name: "scroll", target:  "window",  execute: bodyeventhandler }
                , { name: "resize", target:  "window",  execute: null } //todo: function(event) { me.onresize(event) } }
                , { name: "unload", target:  "window",  execute: null } //todo: function(event) { me.onunload(event) } }
                , { name: "touchstart", target:  "window",  execute: bodyeventhandler }
                , { name: "touchend", target:  "window",  execute: bodyeventhandler }
                , { name: "touchmove", target:  "window",  execute: bodyeventhandler }
                , { name: "mouseout", target:  "window",  execute: bodyeventhandler }
                , { name: "mousedown", target:  "window",  execute: bodyeventhandler }
                , { name: "mouseup", target:  "window",  execute: bodyeventhandler }
                , { name: "mouseover", target:  "window",  execute: bodyeventhandler }
                , { name: "mousemove", target:  "window",  execute: bodyeventhandler }
                , { name: "wheel", target:  "window",  execute: bodyeventhandler }
                , { name: "beforeunload", target:  "window",  execute: null } //todo: function(event) { me.onbeforeunload(event) } }
                , { name: "visibilitychange", target:  "document",  execute: function(event) { me.onvisibilitychange(event) } }
            ]
            
            this.addevent = function (element, eventname, eventhandler) {
                element.addEventListener(eventname, eventhandler, true)
            }

            this.removeevent = function (element, eventname, eventhandler) {
                element.removeEventListener(eventname, eventhandler, true)
            } 
            
            this.observeevents = function() {
                var me = this

                _.foreach(this.eventconfig, function(item) {
                    var target = null

                    switch (item.target) {
                        case "body":
                            target = document.body
                            break
                        case "window":
                            target = window
                            break
                        case "document":
                            target = document
                            break
                    }
                   
                    me.addevent(target, item.name, item.execute)
                })
            }

            this.unobserveevents = function() {
                _.foreach(this.eventconfig, function(item) {
                    var target = null

                    switch (item.target) {
                        case "body":
                            target = document.body
                            break
                        case "window":
                            target = window
                            break
                        case "document":
                            target = document
                            break
                    }
                   
                    me.removeevent(target, item.name, item.execute)
                })
            }            

            this.onresize = _.model.signal()
            this.onunload = _.model.signal()
            this.onbeforeunload = _.model.signal()
            this.onvisibilitychange = _.model.signal()
        })
    })
})
