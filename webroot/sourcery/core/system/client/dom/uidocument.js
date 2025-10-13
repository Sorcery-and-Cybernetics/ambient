//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("uidocument", function(_) {
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
    
    var domstylemethod = _.define.enum("domstylemethod", ["model", "element", "style", "attribute"])

    var getstyledata = function() {
        var styledata = [
            { name: "id", method: domstylemethod.model }
            , { name: "uid", method: domstylemethod.model, readonly: true }
            , { name: "name", method: domstylemethod.model }

            , { name: "html", method: domstylemethod.element, apiname: "innerHTML", triggerlayout: true }
            , { name: "text", method: domstylemethod.element, apiname: "textContent", triggerlayout: true }
            , { name: "class-name", method: domstylemethod.element }
            , { name: "tag", method: domstylemethod.element, readonly: true }

            , { name: "value", method: domstylemethod.element }
            , { name: "src", method: domstylemethod.element }
            , { name: "href", method: domstylemethod.element }
            , { name: "target", method: domstylemethod.element }
            , { name: "title", method: domstylemethod.element }
            , { name: "nosnippet", method: domstylemethod.element }
            , { name: "disabled", method: domstylemethod.element }
            , { name: "checked", method: domstylemethod.element }

            , { name: "left", method: domstylemethod.style, type: "metric", onget: function() { return this.element ? this.element.offsetLeft : null } }
            , { name: "top", method: domstylemethod.style, type: "metric", onget: function() { return this.element ? this.element.offsetTop : null } }
            , { name: "width", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "height", method: domstylemethod.style, type: "metric", triggerlayout: true }

            , { name: "min-width", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "max-width", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "min-height", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "max-height", method: domstylemethod.style, type: "metric", triggerlayout: true }

            , { name: "margin", method: domstylemethod.style, type: "metric" }
            , { name: "margin-left", method: domstylemethod.style, type: "metric" }
            , { name: "margin-top", method: domstylemethod.style, type: "metric" }
            , { name: "margin-right", method: domstylemethod.style, type: "metric" }
            , { name: "margin-bottom", method: domstylemethod.style, type: "metric" }

            , { name: "padding", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "padding-left", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "padding-top", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "padding-right", method: domstylemethod.style, type: "metric", triggerlayout: true }
            , { name: "padding-bottom", method: domstylemethod.style, type: "metric", triggerlayout: true }

            , { name: "scroll-left", method: domstylemethod.element }
            , { name: "scroll-top", method: domstylemethod.element }
            , { name: "scroll-width", method: domstylemethod.element, readonly: true }
            , { name: "scroll-height", method: domstylemethod.element, readonly: true }

            , { name: "overscroll-behavior", method: domstylemethod.style }
            , { name: "scroll-behavior", method: domstylemethod.style }

            , { name: "box-sizing", method: domstylemethod.style, triggerlayout: true }
            , { name: "overflow", method: domstylemethod.style, triggerlayout: true }
            , { name: "overflow-x", method: domstylemethod.style, triggerlayout: true }
            , { name: "overflow-y", method: domstylemethod.style, triggerlayout: true }
            , { name: "z-index", method: domstylemethod.style }

            , { name: "display", method: domstylemethod.style, triggerlayout: true }
            , { name: "position", method: domstylemethod.style, triggerlayout: true }
            , { name: "float", method: domstylemethod.style, triggerlayout: true }
            , { name: "clear", method: domstylemethod.style, triggerlayout: true }
            , { name: "order", method: domstylemethod.style }
            , { name: "pointer-events", method: domstylemethod.style }
            , { name: "contain", method: domstylemethod.style }
            , { name: "aspect-ratio", method: domstylemethod.style, triggerlayout: true }

            , { name: "colorfore", method: domstylemethod.style, apiname: "color" }
            , { name: "colorback", method: domstylemethod.style, apiname: "backgroundColor" }
            , { name: "opacity", method: domstylemethod.style }
            , { name: "visibility", method: domstylemethod.style }

            , { name: "background", method: domstylemethod.style }
            , { name: "background-image", method: domstylemethod.style }
            , { name: "background-size", method: domstylemethod.style }
            , { name: "background-repeat", method: domstylemethod.style }
            , { name: "background-position", method: domstylemethod.style }

            , { name: "font", method: domstylemethod.style, triggerlayout: true }
            , { name: "font-size", method: domstylemethod.style, triggerlayout: true }
            , { name: "font-weight", method: domstylemethod.style, triggerlayout: true }
            , { name: "font-style", method: domstylemethod.style, triggerlayout: true }
            , { name: "line-height", method: domstylemethod.style, triggerlayout: true }
            , { name: "letter-spacing", method: domstylemethod.style, triggerlayout: true }
            , { name: "word-spacing", method: domstylemethod.style, triggerlayout: true }
            , { name: "cursor", method: domstylemethod.style }

            , { name: "text-align", method: domstylemethod.style }
            , { name: "text-decoration", method: domstylemethod.style }
            , { name: "text-transform", method: domstylemethod.style }
            , { name: "text-indent", method: domstylemethod.style }
            , { name: "text-overflow", method: domstylemethod.style }
            , { name: "text-shadow", method: domstylemethod.style }
            , { name: "text-stroke-color", method: domstylemethod.style }
            , { name: "text-fill-color", method: domstylemethod.style }
            , { name: "text-stroke-width", method: domstylemethod.style }
            , { name: "word-wrap", method: domstylemethod.style }
            , { name: "white-space", method: domstylemethod.style }
            , { name: "print-color-adjust", method: domstylemethod.style }
            , { name: "hyphens", method: domstylemethod.style }
            , { name: "hanging-punctuation", method: domstylemethod.style }
            , { name: "tab-size", method: domstylemethod.style }

            , { name: "user-select", method: domstylemethod.style }
            , { name: "touch-action", method: domstylemethod.style }
            , { name: "break-inside", method: domstylemethod.style }
            , { name: "break-before", method: domstylemethod.style }
            , { name: "break-after", method: domstylemethod.style }

            , { name: "border", method: domstylemethod.style }
            , { name: "border-color", method: domstylemethod.style }
            , { name: "border-width", method: domstylemethod.style }
            , { name: "border-style", method: domstylemethod.style }

            , { name: "border-left-color", method: domstylemethod.style }
            , { name: "border-left-width", method: domstylemethod.style }
            , { name: "border-left-style", method: domstylemethod.style }
            , { name: "border-top-color", method: domstylemethod.style }
            , { name: "border-top-width", method: domstylemethod.style }
            , { name: "border-top-style", method: domstylemethod.style }
            , { name: "border-right-color", method: domstylemethod.style }
            , { name: "border-right-width", method: domstylemethod.style }
            , { name: "border-right-style", method: domstylemethod.style }
            , { name: "border-bottom-color", method: domstylemethod.style }
            , { name: "border-bottom-width", method: domstylemethod.style }
            , { name: "border-bottom-style", method: domstylemethod.style }

            , { name: "border-radius", method: domstylemethod.style }
            , { name: "border-top-left-radius", method: domstylemethod.style }
            , { name: "border-top-right-radius", method: domstylemethod.style }
            , { name: "border-bottom-right-radius", method: domstylemethod.style }
            , { name: "border-bottom-left-radius", method: domstylemethod.style }

            , { name: "outline", method: domstylemethod.style }
            , { name: "outline-color", method: domstylemethod.style }
            , { name: "outline-width", method: domstylemethod.style }
            , { name: "outline-style", method: domstylemethod.style }

            , { name: "box-shadow", method: domstylemethod.style }
            , { name: "filter", method: domstylemethod.style }
            , { name: "backdrop-filter", method: domstylemethod.style }
            , { name: "transform", method: domstylemethod.style }
            , { name: "transform-origin", method: domstylemethod.style }
            , { name: "transform-style", method: domstylemethod.style }
            , { name: "backface-visibility", method: domstylemethod.style }
            , { name: "perspective", method: domstylemethod.style }
            , { name: "perspective-origin", method: domstylemethod.style }
            , { name: "clip-path", method: domstylemethod.style }

            , { name: "mask", method: domstylemethod.style }
            , { name: "mask-image", method: domstylemethod.style }
            , { name: "mask-mode", method: domstylemethod.style }
            , { name: "mask-position", method: domstylemethod.style }
            , { name: "mask-repeat", method: domstylemethod.style }
            , { name: "mask-size", method: domstylemethod.style }
            , { name: "mask-composite", method: domstylemethod.style }
            , { name: "mask-type", method: domstylemethod.style }
            , { name: "mask-border", method: domstylemethod.style }
        ]

        var result = {}

        _.foreach(styledata, function(defline) { 
            defline.apiname = defline.apiname || _.camelize(defline.name)
            var name = defline.name.replace(/-/g, "")
            result[name] = defline 
        })        

        return result
    }



    _.define.globalobject("uidocument", function (supermodel) {
        this.istouch = ("createTouch" in document)
        this.lastmousebutton = 0

        this.lasttouchtime = 0
        this.lastmousetime = 0
        this.eventhistory = null

        this.uielements = null
        this.body = null
        this.stylenames = null

        this._dirty = false

        this.constructbehavior = _.behavior(function() {
            this.construct = function() {
                var me = this

                me.uielements = {}
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
            this.setdirty = function() {
                this._dirty = true
            }

            this.finduielement = function(uielement) {
                elementid = (_.isnumber(uielement)? uielement: uielement.uid())

                return this.uielements[elementid]
            }

            this.registeruielement = function(uielement) {
                if (!uielement) { throw "error" }

                var uid = uielement.uid()
                if (!uid) { throw "error" }

                this.uielements[uid] = uielement
                return this
            }

            this.unregisteruielement = function (uielement) {
                if (!uielement) { throw "error" }

                delete this.uielements[uielement.uid()]
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
                if (!relative) {
                    relative = this.body.element

                } else if (relative instanceof _.model.uielement) {
                    relative = relative.element
                }

                if (!element) { throw "error" }

                switch (appendmode) {
                    case _.enum.dom.lastchild:
                        if (!relative.firstChild) {
                            relative.appendChild(element)
                        } else {
                            relative.insertBefore(element, relative.firstChild)
                        }                        
                        break

                    case _.enum.dom.firstchild:
                        if (relative.nextSibling) {
                            relative.parentNode.insertBefore(element, relative.nextSibling)
                        } else {
                            relative.parentNode.appendChild(element)
                        }                       
                        break

                    case _.enum.dom.afterelement:
                        if (relative == document.body) { throw "error" }
                        if (relative.nextSibling) {
                            relative.parentNode.insertBefore(element, relative.nextSibling)
                        } else {
                            relative.parentNode.appendChild(element)
                        }
                        break
                    case _.enum.dom.beforeelement:
                        if (relative == document.body) { throw "error" }
                        relative.parentNode.insertBefore(element, relative)
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
                me.body.handleuievent(event)
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
                , { name: "visibilitychange", target:  "document",  execute: function(event) { 
//                    this.onvisibilitychange(event) 
                } }
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
