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

            this.setdirty = function() { 
                //todo: 
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

            this.set = function(name, value) {
                var def = this.domdocument.stylenames[name]
                if (!def) { return this }
                if (def.readonly) { return this }

                name = def.apiname || name
                if (def.type == "metric") { value = _.cunit(value) }

                if (def.onset) { 
                    value = def.onset.call(this, value)
                } else { 
                    switch (def.method) {
                        case _.enum.domstylemethod.model:
                            this[name](value)
                            break

                        case _.enum.domstylemethod.element:
                            if (this.element) { this.element[name] = value }
                            break

                        case _.enum.domstylemethod.style:
                            this.style(name, value)
                            break

                        case _.enum.domstylemethod.attribute:
                            this.attr(name, value)
                            break                        
                    }
                }

                if (def.triggerlayout) { this.setdirty() }

                return this
            }

            this.get = function(name) {
                var def = this.domdocument.stylenames[name]
                if (!def) { return null }

                name = def.apiname || name

                if (def.onget) {
                    return def.onget.call(this) 

                } else { 
                    switch (def.method) {
                        case _.enum.domstylemethod.model:
                            return this[name]()

                        case _.enum.domstylemethod.element:
                            return this.element ? this.element[name] : null

                        case _.enum.domstylemethod.style:
                            return this.style(name)

                        case _.enum.domstylemethod.attribute:
                            return this.attr(name)
                    }
                }

                return null
            }
        })

        this.positionbehavior = _.behavior(function() {            
            this.boundingrect = function() {
                return this.element ? this.element.getBoundingClientRect() : null
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
                if (!this.listeners) { return this }

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

                    this.element = this.domdocument.createelement(this.tagname(), this.tagtype())
                    this.domdocument.appendlastchild(relative, this.element)

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
                if (this.element) { this.style("display", "") }
                return this
            }

            this.hide = function() {
                if (this.element) { this.style("display", "none") }
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
