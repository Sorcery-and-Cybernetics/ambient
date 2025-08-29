//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("domelement", function(_) {
    _.define.defextender("domstyle", function(supermodel) {
        var makeproperty = function (stylename) {
            return this.style(stylename)
        }

        this.construct = function(stylename) {
            this._stylename = stylename
        }        

        this.definetrait = function (modeldef, traitname) {
            this._name = traitname

            var result = makeproperty(traitname, this._stylename || traitname)
            result.definition = this

            return result            
        }        
    })

    _.define.defextender("domattr", function(supermodel) {
        var makeproperty = function (stylename) {
            return function (value) { 
                return this.attr(value)
            }
        }

        this.construct = function(stylename) {
            this._stylename = stylename
        }          

        this.definetrait = function (modeldef, traitname) {
            this._name = traitname

            var result = makeproperty(this._stylename || traitname)
            result.definition = this

            return result            
        }        
    })    


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

            this.height = function(value) {
                if (value === undefined) { return this.element ? this.element.offsetHeight : null }
                if (this.element) { this.element.style.height = value + "px" }
                return this
            }
            
            this.right = function() {
                return this.element ? this.element.getBoundingClientRect().right : null
            }

            this.bottom = function() {
                return this.element ? this.element.getBoundingClientRect().bottom : null
            }

            this.absoluteleft = function() {
                return this.element ? this.element.getBoundingClientRect().left : null
            }

            this.absolutetop = function() {
                return this.element ? this.element.getBoundingClientRect().top : null
            }

            this.scrolllef = _.model.domstyle("scrollLeft")
            this.scrolltop = _.model.domstyle("scrollTop")
            this.scrollwidth = _.model.domstyle("scrollWidth")
            this.scrollheight = _.model.domstyle("scrollHeight")
            
            //value: absolute, relative, fixed, static
            this.position = _.model.domstyle("position")
            this.overflowx = _.model.domstyle("overflowX")
            this.overflowy = _.model.domstyle("overflowY")
            this.display = _.model.domstyle("display")
            this.float = _.model.domstyle("float")
            this.clear = _.model.domstyle("clear")
            this.order = _.model.domstyle("order")
            this.zindex = _.model.domstyle("zIndex")
        })

        this.flexbehavior = _.behavior(function() {
            this.flex = _.model.domstyle("flex")
            this.flexdirection = _.model.domstyle("flexDirection")
            this.flexwrap = _.model.domstyle("flexWrap")
            this.flexflow = _.model.domstyle("flexFlow")
            this.justifycontent = _.model.domstyle("justifyContent")
            this.alignitems = _.model.domstyle("alignItems")
            this.aligncontent = _.model.domstyle("alignContent")
            this.alignself = _.model.domstyle("alignSelf")
            this.flexbasis = _.model.domstyle("flexBasis")
            this.flexgrow = _.model.domstyle("flexGrow")
            this.flexshrink = _.model.domstyle("flexShrink")
            this.flex = _.model.domstyle("flex")
        })

        this.stylebehavior = _.behavior(function() {
            this.colorfore = function(value) {
                if (value === undefined) { return this.element ? this.element.style.color : null }
                if (this.element) { this.element.style.color = value }
                return this
            }

            this.colorback = function(value) {
                if (value === undefined) { return this.element ? this.element.style.backgroundColor : null }
                if (this.element) { this.element.style.backgroundColor = value }
                return this
            }

            this.opacity = function(value) {
                if (value === undefined) { return this.element ? this.element.style.opacity : null }
                if (this.element) { this.element.style.opacity = value }
                return this
            }

            this.visibility = function(value) {
                if (value === undefined) { return this.element ? this.element.style.visibility : null }
                if (this.element) { this.element.style.visibility = value }
                return this
            }

            this.font = function(value) {
                if (value === undefined) { return this.element ? this.element.style.fontFamily : null }
                if (this.element) { this.element.style.fontFamily = value }
                return this
            }

            this.fontsize = function(value) {
                if (value === undefined) { return this.element ? this.element.style.fontSize : null }
                if (this.element) { this.element.style.fontSize = value }
                return this
            }

            this.fontweight = function(value) {
                if (value === undefined) { return this.element ? this.element.style.fontWeight : null }
                if (this.element) { this.element.style.fontWeight = value }
                return this
            }

            this.fontstyle = function(value) {
                if (value === undefined) { return this.element ? this.element.style.fontStyle : null }
                if (this.element) { this.element.style.fontStyle = value }
                return this
            }            
        }) 
        
        this.textbehavior = _.behavior(function() {
            this.textalign = _.model.domstyle("textAlign")
            this.textdecoration = _.model.domstyle("textDecoration")
            this.texttransform = _.model.domstyle("textTransform")
            this.textindent = _.model.domstyle("textIndent")
            this.textoverflow = _.model.domstyle("textOverflow")
            this.textshadow = _.model.domstyle("textShadow")
            this.textstrokecolor = _.model.domstyle("webkitTextStrokeColor")
            this.textfillcolor = _.model.domstyle("webkitTextFillColor")
            this.textstrokewidth = _.model.domstyle("webkitTextStrokeWidth")
            this.wordwrap = _.model.domstyle("wordWrap")
            this.whitespace = _.model.domstyle("whiteSpace")
            this.printcoloradjust = _.model.domstyle("printColorAdjust")
        })

        this.borderbehavior = _.behavior(function() {
            this.border = _.model.domstyle("border")
            this.borderleftcolor = _.model.domstyle("borderLeftColor")
            this.borderleftwidth = _.model.domstyle("borderLeftWidth")
            this.borderleftstyle = _.model.domstyle("borderLeftStyle")
            this.bordertopcolor = _.model.domstyle("borderTopColor")
            this.bordertopwidth = _.model.domstyle("borderTopWidth")
            this.bordertopstyle = _.model.domstyle("borderTopStyle")
            this.borderrightcolor = _.model.domstyle("borderRightColor")
            this.borderrightwidth = _.model.domstyle("borderRightWidth")
            this.borderrightstyle = _.model.domstyle("borderRightStyle")
            this.borderbottomcolor = _.model.domstyle("borderBottomColor")
            this.borderbottomwidth = _.model.domstyle("borderBottomWidth")
            this.borderbottomstyle = _.model.domstyle("borderBottomStyle")
            
            this.setborder = function (borderarea, color, width, style) {
                var css = this

                color = _.cstr(color)
                style = style || "solid";
                width = width || (color ? 1 : 0)

                if (borderarea & _.area.left) {
                    css.borderleftcolor(color)
                    css.borderleftwidth(width)
                    css.borderleftstyle(style)
                }

                if (borderarea & _.area.top) {
                    css.bordertopcolor(color)
                    css.bordertopwidth(width)
                    css.bordertopstyle(style)
                }

                if (borderarea & _.area.right) {
                    css.borderrightcolor(color)
                    css.borderrightwidth(width)
                    css.borderrightstyle(style)
                }

                if (borderarea & _.area.bottom) {
                    css.borderbottomcolor(color)
                    css.borderbottomwidth(width)
                    css.borderbottomstyle(style)
                }
                return this;
            }
            
            this.borderradius = _.model.domstyle("borderRadius")
            this.bordertopleftradius = _.model.domstyle("borderTopLeftRadius")
            this.bordertoprightradius = _.model.domstyle("borderTopRightRadius")
            this.borderbottomrightradius = _.model.domstyle("borderBottomRightRadius")
            this.borderbottomleftradius = _.model.domstyle("borderBottomLeftRadius")
            
            this.setborderradius = function (topleft, topright, bottomright, bottomleft) {
                var css = this

                if (topleft != null) { css.bordertopleftradius(topleft) }
                if (topright != null) { css.bordertoprightradius(topright) }
                if (bottomright != null) { css.borderbottomrightradius(bottomright) }
                if (bottomleft != null) { css.borderbottomleftradius(bottomleft) }

                return this
            } 
        })

        this.effectbehavior = _.behavior(function() {            
            this.boxshadow = function(value) {
                if (value === undefined) { return this.element ? this.element.style.boxShadow : null }
                if (this.element) { this.element.style.boxShadow = value }
                return this
            }
            
            this.setboxshadow = function (x, y, spread, blur, inner, color, add) {
                x = _.cunit(x != null ? x : 2) + " "
                y = _.cunit(y != null ? y : 2) + " "
                spread = spread != null ? spread : 2
                blur = blur != null ? blur : spread
                spread = _.cunit(spread) + " "
                blur = _.cunit(blur) + " "
                inner = inner ? "inset " : ""
                color = color || "#888"

                var css = this

                var current = ""

                if (add) {
                    current = css.boxshadow()
                    if (current) { current += ", " }
                }

                return css.boxshadow(current + inner + x + y + blur + spread + color)
            }
            
            this.setinnershadow = function (x, y, blur, color) {
                return this.setshadow(x, y, 0, blur, true, color)
            }

            this.addinnershadow = function (x, y, blur, color) {
                return this.setshadow(x, y, 0, blur, true, color, true)
            }

            this.setoutershadow = function (x, y, blur, color) {
                return this.setshadow(x, y, 0, blur, false, color)
            }

            this.addoutershadow = function (x, y, blur, color) {
                return this.setshadow(x, y, 0, blur, false, color, true)
            }            

            this.filter = function(value) {
                if (value === undefined) { return this.element ? this.element.style.filter : null }
                if (this.element) { this.element.style.filter = value }
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
