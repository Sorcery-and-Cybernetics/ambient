//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("domelement", function(_) {
    _.define.object("domelement", function(supermodel) {
        this.element = null
        this.listeners = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(element) {
                if (!element) { throw "error" }
                if (!element._uid) { element._uid = _.uniqueid() }
                this.element = element
            }

            this.destroy = function() {
                this.clearevents()

                var element = this.element
                if (element) {
                    this.element = null
                    if (element.parentNode) {
                        element.parentNode.removeChild(element)
                    }
                }
                return null
            }

            this.exists = function() {
                return !!(this.element && document.documentElement.contains(this.element))
            }
        })

        this.objectbehavior = _.behavior(function() {
            this.id = function(value) {
                if (value === undefined) { return (this.element? this.element.id: null) }

                if (this.element) { this.element.id = value }
                return this
            }  
            
            this.uid = function(value) {
                if (value === undefined) { return (this.element? this.element._uid: null) }

                if (this.element) { this.element._uid = value }
                return this
            } 
            
            this.tag = function() {
                return this.element? _.lcase$(this.element.tagName): null
            } 

            this.classname = function(value) {
                if (value === undefined) { return (this.element? this.element.className: null) }

                if (this.element) { this.element.className = value }
                return this            
            }

            this.text = function(value) {
                if (value === undefined) { return (this.element? this.element.textContent: null) }

                if (this.element) { this.element.textContent = value }
                return this           
            }

            this.html = function(value) {
                if (value === undefined) { return (this.element? this.element.innerHTML: null) }

                if (this.element) { this.element.innerHTML = value }
                return this
            }

            this.attr = function(name, value) {
                if (value === undefined) { return this.element? this.element.getAttribute(name): null }

                if (this.element) {
                    if (value === null) { 
                        this.element.removeAttribute(name) 

                    } else { 
                        this.element.setAttribute(name, value) 
                    }
                }
                return this
            }

            this.style = function(name, value) {
                if (value === undefined) { return this.element? this.element.style[name]: null }

                if (this.element) { this.element.style[name] = value }
                return this
            }
        })

        this.positionbehavior = _.behavior(function() {
            this.boundingrect = function() {
                return this.element ? this.element.getBoundingClientRect() : null
            }

            this.left = function(value) {
                if (value === undefined) { return this.element ? this.element.offsetLeft : null }
                if (this.element) { this.element.style.left = value + "px" }
                return this
            }

            this.top = function(value) {
                if (value === undefined) { return this.element ? this.element.offsetTop : null }
                if (this.element) { this.element.style.top = value + "px" }
                return this
            }

            this.width = function(value) {
                if (value === undefined) { return this.element ? this.element.offsetWidth : null }
                if (this.element) { this.element.style.width = value + "px" }
                return this
            }

            this.absoluteleft = function() {
                return this.element ? this.element.getBoundingClientRect().left : null
            }

            this.absolutetop = function() {
                return this.element ? this.element.getBoundingClientRect().top : null
            }

            this.height = function(value) {
                if (value === undefined) { return this.element ? this.element.offsetHeight : null }
                if (this.element) { this.element.style.height = value + "px" }
                return this
            }  
            
            this.scrolltop = function(value) {
                if (value === undefined) { return this.element ? this.element.scrollTop : null }
                if (this.element) { this.element.scrollTop = value }
                return this
            }

            this.scrollleft = function(value) {
                if (value === undefined) { return this.element ? this.element.scrollLeft : null }
                if (this.element) { this.element.scrollLeft = value }
                return this
            }  

            this.scrollwidth = function() {
                return this.element ? this.element.scrollWidth : null
            }  

            this.scrollheight = function() {
                return this.element ? this.element.scrollHeight : null
            }            
        })
        
        this.eventbehavior = _.behavior(function() {
            this.addevent = function(name, callback) {
                if (!this.element) { return this }
                if (!this.listeners) { this.listeners = {} }
                if (this.listeners[name]) { this.delevent(name) }
                this.listeners[name] = callback
                this.element.addEventListener(name, callback)
                return this
            }

            this.delevent = function(name) {
                if (this.listeners && this.listeners[name]) {
                    if (this.element) { 
                        this.element.removeEventListener(name, this.listeners[name]) 
                    }
                    delete this.listeners[name]
                }
                return this
            }

            this.clearevents = function() {
                for (var name in this.listeners) {
                    this.delevent(name)
                }

                this.listeners = null
                return this
            } 
        })       


        this.statebehavior = _.behavior(function() {
            this.show = function() {
                if (this.element) { this.element.style.display = "" }
                return this
            }

            this.hide = function() {
                if (this.element) { this.element.style.display = "none" }
                return this
            }

            this.focus = function() {
                if (this.element && this.element.focus) { this.element.focus() }
                return this
            }

            this.defocus = function() {
                if (this.element && this.element.blur) { this.element.blur() }
                return this
            }        

            this.enabled = function(value) {
                if (value === undefined) { return !(this.element && this.element.disabled) }

                if (this.element) { this.element.disabled = !value }
                return this
            } 
        })       
    })
})
