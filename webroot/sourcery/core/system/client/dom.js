//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("dom", function(_) {
    _.define.enum("dom", ["lastchild", "firstchild", "afterelement", "beforeelement", "body"], 0)

    _.define.globalobject("dom", function (supermodel) {
        this.istouch = ("createTouch" in document)
        this.lastmousebutton = 0

        this.lasttouchtime = 0
        this.lastmousetime = 0
        this.eventhistory = null

        this.elements = null

        this.construct = function() {
            this.elements = {}
            this.eventhistory = {}
        }

        this.orientation = function () { return (this.pagewidth() >= (this.pageheight())) ? "landscape" : "portrait" }

        this.pageleft = function () { return _.dom.page? _.dom.page.currentstyle.left: 0 }
        this.pagetop = function () { return _.dom.page? _.dom.page.currentstyle.top: 0 }
        this.pagewidth = function () { return document.body.clientWidth }
        this.pageheight = function () { return document.body.clientHeight }

        this.bodyleft = function () { return _.dom.page? _.dom.page.currentstyle.left: 0 }
        this.bodytop = function () { return _.dom.page? _.dom.page.currentstyle.top: 0 }
        this.bodywidth = function () { return _.dom.page? _.dom.page.currentstyle.width: 0 }
        this.bodyheight = function () { return _.dom.page? _.dom.page.currentstyle.height: 0 }

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

        this.scrolwidth = function () { return document.body.scrollWidth }
        this.scrolheight = function () { return document.body.scrollHeight }

        this.page = function () { return document.body }

        this.attribute = function(element, name, value) {
            if (value === undefined) { return element.getAttribute(name) }
            element.setAttribute(name, value)
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

            element._uid = _.uniqueid()
            this.elements[element._uid] = element

            return element
        }

        this.appendlastchild = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.lastchild) }
        this.appendfirstchild = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.firstchild) }
        this.appendafter = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.afterelement) }
        this.appendbefore = function(relative, element) { return this.appendelement(relative, element, _.enum.dom.beforeelement) }

        this.removeelement = function (element) {
            if (!element) { _.system.warn("Element doesn't exist") }

            if (element._uid) { delete this.elements[element._uid] }
            element.parentNode.removeChild(element)

            return this
        } 
    })    
})