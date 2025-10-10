//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

//todo: Optimize: Looping through properties.
//todo: Optimize: Triggering draw phases.

_.ambient.module("widget", function(_) {
    _.define.property("widgetstyle")

    _.define.enum("widgetphase", ["destroy", "none", "assign", "load", "show", "render"], -1)

    _.define.model("widget", function (supermodel) {

        this.tagname = "DIV"
        this.tagtype = ""


        this._phase = 0
        this.phases = _.enum.widgetphase

        this.behavior = _.efb.none
        this.behaviors = _.efb
        
        this.child = _.list()

        this.element = null

        this.parentuid = function() {
            var parent = this.parent()

            return (parent? parent.uid(): 0)
        }

        this.objectbehavior = _.behavior(function() {
            this.text = _.property("")

            this.assignto = function(parent, orderindex, relative) {
                parent.addchild(this, orderindex, relative)
            }

            this.assign = function(widget, orderindex, relative) {
                this.child.add(widget, orderindex, relative)
            }

        // this.assignto = function(parent, name, orderindex) {
        //     this._parent = parent
        //     this._name = name

        //     this._parent = parent || _.dom.page
        //     this._parent._childinsert(this, name, orderindex)

        //     this.setdirty()
        //     this._phase = this.phases.assigned

        //     return this
        // }            

            this.delchild = function(widget) {
                widget.destroy()
            }

            this.onshow = undefined
            this.onhide = undefined
            this.onrender = undefined
            this.onskin = undefined
            this.onlayout = undefined

            this.load = function () {
                if (this.onload) { this.onload() }
                this.phase = this.phases.load
                return this
            }        

            this.show = function () {
                if (this._parent.phase < this.phases.show) { this._parent.show() }

                if (this.phase < this.phases.load) { this.load() }
                if (this.onshow) { this.onshow()}
                this.phase = this.phases.show

                this.setdirty()
                return this
            }

            this.hide = function() {

            }

            this.unload = function() {

            }
            
            this.destroy = function() {
                this._domdestroy()
                supermodel.destroy.call(this)
            }
        })

        this.renderbehavior = _.behavior(function() {

            //Dirty mode:
            // < 0 : widget is locked
            // 0 : nothing to repaint
            // 1: repaint self
            // 2 : force repaint on all children
            // 4 : repaint child
            this.setdirty = function (dirtymode) {
                if (this.dirty < 0) { return } //todo: check when this is needed.

                if (!_.isnumber(dirtymode)) {
                    //todo: if it's an transaction, we might need to push this through the chain.
                    dirtymode = 1
                } 

                if (!this.dirty) {
                    if (this._parent) {
                        this._parent.setdirty(4)
                    } else {
                        _.dom.setdirty()
                    }
                }

                this.dirty |= (dirtymode || 1);
                return this;
            } 

            this.render = function(force, resizing) {
                var me = this

                if (this.isdestroy()) { return this }

                var dirty = this.dirty
                force = force || !!(this.dirty & 2)

                if (this.widgetstate < this.phases.show) {
                    this.show()
                }  
                
                this._domcreate()
                this.phase = this.phases.render

                this.dirty = 0

                var maxwidth = 0
                var maxheight = 0

                if (this.onrender) {this.onrender() }
                if (this.onlayout) { this.onlayout() }
                if (this.onskin) { this.onskin() }

                this.child.foreach(function (child) {
                    if (child.dirty || force) {
                        child.render(force, resizing)
                    } else if (resizing) {
                        var childstyle = child.style()

                        if ((childstyle.right() != null) || (childstyle.bottom() != null)) {
                            child.render(undefined, resizing)
                        }
                    }
                })

                this.phase = this.phases.show

                return this
            }
            
            this.skin = undefined
            this.layout = undefined

            this._domcreate = function() {
                var me = this

                if (!this.tagname) { return this }
                if (!this._parent) { return this }

                if (!this.element) {
                    this.element = _.model.domelement(this)
                    //todo: loop through all properties, and update the element
                    _.foreach(me, function(trait, name) {
                        switch (trait._definition.modelname()) {
                            case "widgetstyle":
                                me.element.set(name, trait())
                                break
                        }
                    })

                }



                // this.element = _.dom.createelement(this.tagname, this.tagtype)

                // this.element.className = this.__kindname + " " + this.name //+ " " + this.name + this.activeclasses
                // _.dom.appendelement(this.element, relative.element, appendmode)
                
                // _.dom.registercontrol(this)            

                return this
            }

            this._domdestroy = function() {
                if (this.element) {
                    this.element.destroy()
                    this.element = null
                }
            }

        })

        this.positionbehavior = _.behavior(function() {            
            this.left = _.model.widgetstyle(1)
            this.top = _.model.widgetstyle(1)
            this.width = _.model.widgetstyle(60)
            this.height = _.model.widgetstyle(20)

            this.move = function (left, top, width, height, right, bottom) {
                var me = this

                // if (left instanceof _.model.rect) {
                //     me.left(left.x)
                //     me.top(left.y)
                //     me.width(left.width)
                //     me.height(left.height)
                // } else {
                    me.left(left)
                    me.top(top)
                    me.width(width)
                    me.height(height)

                    me.right(right)
                    me.bottom(bottom)
                // }
                return this
            }           
        })            

        

        // this.positionbehavior = _.behavior(function() {            
        //     this.boundingrect = function() {
        //         return this.element ? this.element.getBoundingClientRect() : null
        //     }

        //     this.left = function(value) {
        //         if (value === undefined) { return this.element ? this.element.offsetLeft : null }
        //         if (this.element) { this.element.style.left = value + "px" }
        //         return this
        //     }

        //     this.top = function(value) {
        //         if (value === undefined) { return this.element ? this.element.offsetTop : null }
        //         if (this.element) { this.element.style.top = value + "px" }
        //         return this
        //     }

        //     this.width = function(value) {
        //         if (value === undefined) { return this.element ? this.element.offsetWidth : null }
        //         if (this.element) { this.element.style.width = value + "px" }
        //         return this
        //     }

        //     this.height = function(value) {
        //         if (value === undefined) { return this.element ? this.element.offsetHeight : null }
        //         if (this.element) { this.element.style.height = value + "px" }
        //         return this
        //     }
            
        //     this.right = function() {
        //         return this.element ? this.element.getBoundingClientRect().right : null
        //     }

        //     this.bottom = function() {
        //         return this.element ? this.element.getBoundingClientRect().bottom : null
        //     }

        //     this.absoluteleft = function() {
        //         return this.element ? this.element.getBoundingClientRect().left : null
        //     }

        //     this.absolutetop = function() {
        //         return this.element ? this.element.getBoundingClientRect().top : null
        //     }

        //     this.scrolllef = _.model.widgetstyle("scrollLeft")
        //     this.scrolltop = _.model.widgetstyle("scrollTop")
        //     this.scrollwidth = _.model.widgetstyle("scrollWidth")
        //     this.scrollheight = _.model.widgetstyle("scrollHeight")
            
        //     //value: absolute, relative, fixed, static
        //     this.position = _.model.widgetstyle("position")
        //     this.overflowx = _.model.widgetstyle("overflowX")
        //     this.overflowy = _.model.widgetstyle("overflowY")
        //     this.display = _.model.widgetstyle("display")
        //     this.float = _.model.widgetstyle("float")
        //     this.clear = _.model.widgetstyle("clear")
        //     this.order = _.model.widgetstyle("order")
        //     this.zindex = _.model.widgetstyle("zIndex")
        // })

        // this.flexbehavior = _.behavior(function() {
        //     this.flex = _.model.widgetstyle("flex")
        //     this.flexdirection = _.model.widgetstyle("flexDirection")
        //     this.flexwrap = _.model.widgetstyle("flexWrap")
        //     this.flexflow = _.model.widgetstyle("flexFlow")
        //     this.justifycontent = _.model.widgetstyle("justifyContent")
        //     this.alignitems = _.model.widgetstyle("alignItems")
        //     this.aligncontent = _.model.widgetstyle("alignContent")
        //     this.alignself = _.model.widgetstyle("alignSelf")
        //     this.flexbasis = _.model.widgetstyle("flexBasis")
        //     this.flexgrow = _.model.widgetstyle("flexGrow")
        //     this.flexshrink = _.model.widgetstyle("flexShrink")
        //     this.flex = _.model.widgetstyle("flex")
        // })

        // this.stylebehavior = _.behavior(function() {
        //     this.colorfore = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.color : null }
        //         if (this.element) { this.element.style.color = value }
        //         return this
        //     }

        //     this.colorback = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.backgroundColor : null }
        //         if (this.element) { this.element.style.backgroundColor = value }
        //         return this
        //     }

        //     this.opacity = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.opacity : null }
        //         if (this.element) { this.element.style.opacity = value }
        //         return this
        //     }

        //     this.visibility = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.visibility : null }
        //         if (this.element) { this.element.style.visibility = value }
        //         return this
        //     }

        //     this.font = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.fontFamily : null }
        //         if (this.element) { this.element.style.fontFamily = value }
        //         return this
        //     }

        //     this.fontsize = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.fontSize : null }
        //         if (this.element) { this.element.style.fontSize = value }
        //         return this
        //     }

        //     this.fontweight = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.fontWeight : null }
        //         if (this.element) { this.element.style.fontWeight = value }
        //         return this
        //     }

        //     this.fontstyle = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.fontStyle : null }
        //         if (this.element) { this.element.style.fontStyle = value }
        //         return this
        //     }            
        // }) 
        
        // this.textbehavior = _.behavior(function() {
        //     this.textalign = _.model.widgetstyle("textAlign")
        //     this.textdecoration = _.model.widgetstyle("textDecoration")
        //     this.texttransform = _.model.widgetstyle("textTransform")
        //     this.textindent = _.model.widgetstyle("textIndent")
        //     this.textoverflow = _.model.widgetstyle("textOverflow")
        //     this.textshadow = _.model.widgetstyle("textShadow")
        //     this.textstrokecolor = _.model.widgetstyle("webkitTextStrokeColor")
        //     this.textfillcolor = _.model.widgetstyle("webkitTextFillColor")
        //     this.textstrokewidth = _.model.widgetstyle("webkitTextStrokeWidth")
        //     this.wordwrap = _.model.widgetstyle("wordWrap")
        //     this.whitespace = _.model.widgetstyle("whiteSpace")
        //     this.printcoloradjust = _.model.widgetstyle("printColorAdjust")
        // })

        // this.borderbehavior = _.behavior(function() {
        //     this.border = _.model.widgetstyle("border")
        //     this.borderleftcolor = _.model.widgetstyle("borderLeftColor")
        //     this.borderleftwidth = _.model.widgetstyle("borderLeftWidth")
        //     this.borderleftstyle = _.model.widgetstyle("borderLeftStyle")
        //     this.bordertopcolor = _.model.widgetstyle("borderTopColor")
        //     this.bordertopwidth = _.model.widgetstyle("borderTopWidth")
        //     this.bordertopstyle = _.model.widgetstyle("borderTopStyle")
        //     this.borderrightcolor = _.model.widgetstyle("borderRightColor")
        //     this.borderrightwidth = _.model.widgetstyle("borderRightWidth")
        //     this.borderrightstyle = _.model.widgetstyle("borderRightStyle")
        //     this.borderbottomcolor = _.model.widgetstyle("borderBottomColor")
        //     this.borderbottomwidth = _.model.widgetstyle("borderBottomWidth")
        //     this.borderbottomstyle = _.model.widgetstyle("borderBottomStyle")
            
        //     this.setborder = function (borderarea, color, width, style) {
        //         var css = this

        //         color = _.cstr(color)
        //         style = style || "solid";
        //         width = width || (color ? 1 : 0)

        //         if (borderarea & _.area.left) {
        //             css.borderleftcolor(color)
        //             css.borderleftwidth(width)
        //             css.borderleftstyle(style)
        //         }

        //         if (borderarea & _.area.top) {
        //             css.bordertopcolor(color)
        //             css.bordertopwidth(width)
        //             css.bordertopstyle(style)
        //         }

        //         if (borderarea & _.area.right) {
        //             css.borderrightcolor(color)
        //             css.borderrightwidth(width)
        //             css.borderrightstyle(style)
        //         }

        //         if (borderarea & _.area.bottom) {
        //             css.borderbottomcolor(color)
        //             css.borderbottomwidth(width)
        //             css.borderbottomstyle(style)
        //         }
        //         return this;
        //     }
            
        //     this.borderradius = _.model.widgetstyle("borderRadius")
        //     this.bordertopleftradius = _.model.widgetstyle("borderTopLeftRadius")
        //     this.bordertoprightradius = _.model.widgetstyle("borderTopRightRadius")
        //     this.borderbottomrightradius = _.model.widgetstyle("borderBottomRightRadius")
        //     this.borderbottomleftradius = _.model.widgetstyle("borderBottomLeftRadius")
            
        //     this.setborderradius = function (topleft, topright, bottomright, bottomleft) {
        //         var css = this

        //         if (topleft != null) { css.bordertopleftradius(topleft) }
        //         if (topright != null) { css.bordertoprightradius(topright) }
        //         if (bottomright != null) { css.borderbottomrightradius(bottomright) }
        //         if (bottomleft != null) { css.borderbottomleftradius(bottomleft) }

        //         return this
        //     } 
        // })

        // this.effectbehavior = _.behavior(function() {            
        //     this.boxshadow = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.boxShadow : null }
        //         if (this.element) { this.element.style.boxShadow = value }
        //         return this
        //     }
            
        //     this.setboxshadow = function (x, y, spread, blur, inner, color, add) {
        //         x = _.cunit(x != null ? x : 2) + " "
        //         y = _.cunit(y != null ? y : 2) + " "
        //         spread = spread != null ? spread : 2
        //         blur = blur != null ? blur : spread
        //         spread = _.cunit(spread) + " "
        //         blur = _.cunit(blur) + " "
        //         inner = inner ? "inset " : ""
        //         color = color || "#888"

        //         var css = this

        //         var current = ""

        //         if (add) {
        //             current = css.boxshadow()
        //             if (current) { current += ", " }
        //         }

        //         return css.boxshadow(current + inner + x + y + blur + spread + color)
        //     }
            
        //     this.setinnershadow = function (x, y, blur, color) {
        //         return this.setshadow(x, y, 0, blur, true, color)
        //     }

        //     this.addinnershadow = function (x, y, blur, color) {
        //         return this.setshadow(x, y, 0, blur, true, color, true)
        //     }

        //     this.setoutershadow = function (x, y, blur, color) {
        //         return this.setshadow(x, y, 0, blur, false, color)
        //     }

        //     this.addoutershadow = function (x, y, blur, color) {
        //         return this.setshadow(x, y, 0, blur, false, color, true)
        //     }            

        //     this.filter = function(value) {
        //         if (value === undefined) { return this.element ? this.element.style.filter : null }
        //         if (this.element) { this.element.style.filter = value }
        //         return this
        //     }
        // })

        // this.statebehavior = _.behavior(function() {
        //     this.show = function() {
        //     }

        //     this.hide = function() {
        //     }

        //     this.focus = function() {
        //     }

        //     this.defocus = function() {
        //     }        

        //     this.enabled = function(value) {
        //     } 
        // })       


    })
})