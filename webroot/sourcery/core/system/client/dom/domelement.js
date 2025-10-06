//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("domelement", function(_) {
    _.define.object("domelement", function(supermodel) {
        this.element = null
        this.listeners = null

        this.domdocument = null
        this.widget = null
        this._uid = 0

        this.tagname = _.property("DIV")
        this.tagtype = _.property("")

        this.constructbehavior = _.behavior(function() {
            this.construct = function(widget) {
                this.domdocument = _.domdocument

                if (!widget) { throw "error" }
                this.widget = widget         
                this._uid = widget.uid()

                this.tagname(widget.tagname())
                this.tagtype(widget.tagtype())
            }

            this.destroy = function() {
                this.unload()
                this.widget = null

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
            
            this.uid = function() {
                return this._uid
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
            this.load = function() {
                if (!this.element) {
                    var relative = this.domdocument.findelement(this.widget.parentuid())
//                    if (!relative) { throw "error" }

                    this.element = this.domdocument.createelement(this.tagname(), this.tagtype())
                    this.document.appendlastchild(relative, this.element)

//                    this.domdocument.appendelement(relative, null, appendmode)

                }
            }

            this.unload = function() {
                this.clearevents()

                if (this.element) {
                    this.domdocument.unregisterdomelement(this)
                    this.domdocument.removeelement(this.element)
                }
            }

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
