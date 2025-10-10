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
    
    var domestylemethod = _.define.enum("domstylemethod", ["model", "element", "style", "attribute"])

    var getstyledata = function() {
        var styledata = [
            { name: "id", method: _.domstylemethod.model },
            { name: "uid", method: _.domstylemethod.model, readonly: true },
            { name: "name", method: _.domstylemethod.model },

            { name: "html", method: _.domstylemethod.element, triggerlayout: true },
            { name: "text", method: _.domstylemethod.element, triggerlayout: true },
            { name: "class-name", method: _.domstylemethod.element },
            { name: "tag", method: _.domstylemethod.element, readonly: true },

            { name: "value", method: _.domstylemethod.element },
            { name: "src", method: _.domstylemethod.element },
            { name: "href", method: _.domstylemethod.element },
            { name: "target", method: _.domstylemethod.element },
            { name: "title", method: _.domstylemethod.element },
            { name: "nosnippet", method: _.domstylemethod.element },
            { name: "disabled", method: _.domstylemethod.element },
            { name: "checked", method: _.domstylemethod.element },

            { name: "left", method: _.domstylemethod.style, type: "metric", onget: function() { return this.element ? this.element.offsetLeft : null } },
            { name: "top", method: _.domstylemethod.style, type: "metric", onget: function() { return this.element ? this.element.offsetTop : null } },
            { name: "width", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "height", method: _.domstylemethod.style, type: "metric", triggerlayout: true },

            { name: "min-width", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "max-width", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "min-height", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "max-height", method: _.domstylemethod.style, type: "metric", triggerlayout: true },

            { name: "margin", method: _.domstylemethod.style, type: "metric" },
            { name: "margin-left", method: _.domstylemethod.style },
            { name: "margin-top", method: _.domstylemethod.style },
            { name: "margin-right", method: _.domstylemethod.style },
            { name: "margin-bottom", method: _.domstylemethod.style },

            { name: "padding", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "padding-left", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "padding-top", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "padding-right", method: _.domstylemethod.style, type: "metric", triggerlayout: true },
            { name: "padding-bottom", method: _.domstylemethod.style, type: "metric", triggerlayout: true },

            { name: "scroll-left", method: _.domstylemethod.element },
            { name: "scroll-top", method: _.domstylemethod.element },
            { name: "scroll-width", method: _.domstylemethod.element, readonly: true },
            { name: "scroll-height", method: _.domstylemethod.element, readonly: true },

            { name: "overscroll-behavior", method: _.domstylemethod.style },
            { name: "scroll-behavior", method: _.domstylemethod.style },

            { name: "box-sizing", method: _.domstylemethod.style, triggerlayout: true },
            { name: "overflow", method: _.domstylemethod.style, triggerlayout: true },
            { name: "overflow-x", method: _.domstylemethod.style, triggerlayout: true },
            { name: "overflow-y", method: _.domstylemethod.style, triggerlayout: true },
            { name: "z-index", method: _.domstylemethod.style },

            { name: "display", method: _.domstylemethod.style, triggerlayout: true },
            { name: "position", method: _.domstylemethod.style, triggerlayout: true },
            { name: "float", method: _.domstylemethod.style, triggerlayout: true },
            { name: "clear", method: _.domstylemethod.style, triggerlayout: true },
            { name: "order", method: _.domstylemethod.style },
            { name: "pointer-events", method: _.domstylemethod.style },
            { name: "contain", method: _.domstylemethod.style },
            { name: "aspect-ratio", method: _.domstylemethod.style, triggerlayout: true },

            { name: "color-fore", method: _.domstylemethod.style },
            { name: "color-back", method: _.domstylemethod.style },
            { name: "opacity", method: _.domstylemethod.style },
            { name: "visibility", method: _.domstylemethod.style },

            { name: "background", method: _.domstylemethod.style },
            { name: "background-image", method: _.domstylemethod.style },
            { name: "background-size", method: _.domstylemethod.style },
            { name: "background-repeat", method: _.domstylemethod.style },
            { name: "background-position", method: _.domstylemethod.style },

            { name: "font", method: _.domstylemethod.style, triggerlayout: true },
            { name: "font-size", method: _.domstylemethod.style, triggerlayout: true },
            { name: "font-weight", method: _.domstylemethod.style, triggerlayout: true },
            { name: "font-style", method: _.domstylemethod.style, triggerlayout: true },
            { name: "line-height", method: _.domstylemethod.style, triggerlayout: true },
            { name: "letter-spacing", method: _.domstylemethod.style, triggerlayout: true },
            { name: "word-spacing", method: _.domstylemethod.style, triggerlayout: true },
            { name: "cursor", method: _.domstylemethod.style },

            { name: "text-align", method: _.domstylemethod.style },
            { name: "text-decoration", method: _.domstylemethod.style },
            { name: "text-transform", method: _.domstylemethod.style },
            { name: "text-indent", method: _.domstylemethod.style },
            { name: "text-overflow", method: _.domstylemethod.style },
            { name: "text-shadow", method: _.domstylemethod.style },
            { name: "text-stroke-color", method: _.domstylemethod.style },
            { name: "text-fill-color", method: _.domstylemethod.style },
            { name: "text-stroke-width", method: _.domstylemethod.style },
            { name: "word-wrap", method: _.domstylemethod.style },
            { name: "white-space", method: _.domstylemethod.style },
            { name: "print-color-adjust", method: _.domstylemethod.style },
            { name: "hyphens", method: _.domstylemethod.style },
            { name: "hanging-punctuation", method: _.domstylemethod.style },
            { name: "tab-size", method: _.domstylemethod.style },

            { name: "user-select", method: _.domstylemethod.style },
            { name: "touch-action", method: _.domstylemethod.style },
            { name: "break-inside", method: _.domstylemethod.style },
            { name: "break-before", method: _.domstylemethod.style },
            { name: "break-after", method: _.domstylemethod.style },

            { name: "border", method: _.domstylemethod.style },
            { name: "border-color", method: _.domstylemethod.style },
            { name: "border-width", method: _.domstylemethod.style },
            { name: "border-style", method: _.domstylemethod.style },

            { name: "border-left-color", method: _.domstylemethod.style },
            { name: "border-left-width", method: _.domstylemethod.style },
            { name: "border-left-style", method: _.domstylemethod.style },
            { name: "border-top-color", method: _.domstylemethod.style },
            { name: "border-top-width", method: _.domstylemethod.style },
            { name: "border-top-style", method: _.domstylemethod.style },
            { name: "border-right-color", method: _.domstylemethod.style },
            { name: "border-right-width", method: _.domstylemethod.style },
            { name: "border-right-style", method: _.domstylemethod.style },
            { name: "border-bottom-color", method: _.domstylemethod.style },
            { name: "border-bottom-width", method: _.domstylemethod.style },
            { name: "border-bottom-style", method: _.domstylemethod.style },

            { name: "border-radius", method: _.domstylemethod.style },
            { name: "border-top-left-radius", method: _.domstylemethod.style },
            { name: "border-top-right-radius", method: _.domstylemethod.style },
            { name: "border-bottom-right-radius", method: _.domstylemethod.style },
            { name: "border-bottom-left-radius", method: _.domstylemethod.style },

            { name: "outline", method: _.domstylemethod.style },
            { name: "outline-color", method: _.domstylemethod.style },
            { name: "outline-width", method: _.domstylemethod.style },
            { name: "outline-style", method: _.domstylemethod.style },

            { name: "box-shadow", method: _.domstylemethod.style },
            { name: "filter", method: _.domstylemethod.style },
            { name: "backdrop-filter", method: _.domstylemethod.style },
            { name: "transform", method: _.domstylemethod.style },
            { name: "transform-origin", method: _.domstylemethod.style },
            { name: "transform-style", method: _.domstylemethod.style },
            { name: "backface-visibility", method: _.domstylemethod.style },
            { name: "perspective", method: _.domstylemethod.style },
            { name: "perspective-origin", method: _.domstylemethod.style },
            { name: "clip-path", method: _.domstylemethod.style },

            { name: "mask", method: _.domstylemethod.style },
            { name: "mask-image", method: _.domstylemethod.style },
            { name: "mask-mode", method: _.domstylemethod.style },
            { name: "mask-position", method: _.domstylemethod.style },
            { name: "mask-repeat", method: _.domstylemethod.style },
            { name: "mask-size", method: _.domstylemethod.style },
            { name: "mask-composite", method: _.domstylemethod.style },
            { name: "mask-type", method: _.domstylemethod.style },
            { name: "mask-border", method: _.domstylemethod.style }
        ]


        var result = {}

        _.foreach(styledata, function(defline) { 
            defline.apiname = defline.apiname || _.camilize(defline.name)
            var name = defline.name.replace(/-/g, "")
            result[name] = defline 
        })        

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
        this.stylenames = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function() {
                var me = this

                me.elements = {}
                me.eventhistory = {}
                me.stylenames = getstyledata()

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
