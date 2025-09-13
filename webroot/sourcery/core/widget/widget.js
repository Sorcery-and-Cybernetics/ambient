_.ambient.module("widget", function(_) {
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


    _.define.enum("widgetphase", ["destroy", "none", "assign", "load", "show", "render"], -1)

    _.define.model("widget", function (supermodel) {

        this.tagname = "DIV"
        this.tagtype = ""


        this._phase = 0
        this.phases = _.enum.widgetphase

        this.behavior = _.efb.none
        this.behaviors = _.efb
        
        this.widget = _.list()

        this.element = null

        this.objectbehavior = _.behavior(function() {
            this.assignto = function(parent, orderindex, relative) {
                if (parent instanceof _.model.list) {
                    parent.add(this, orderindex, relative)
                }
            }

            this.onshow = _.noop
            this.onhide = _.noop
            this.onrender = _.noop
            this.onskin = _.noop
            this.onarrange = _.noop      

        this.load = function () {
            if (this.onload) { this.onload() }
            this.phase = this.phases.load
            return this
        }        

        this.show = function () {
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
            if (this.dirty < 0) { return }

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

            this.widget.foreach(function (child) {
                if (child.dirty || force) {
                    child.render(force, resizing)
                } else if (resizing) {
                    var childstyle = child.style()

                    if ((childstyle.right() != null) || (childstyle.bottom() != null)) {
                        child.render(undefined, resizing)
                    }
                }
            })

            this.onrender()

            this.phase = this.phases.show

            return this
        }
        
        this.skin = function() {}
        this.arrange = function() {}

        this._domcreate = function() {
            if (this.element) { return this }
            if (!this.tagname) { return this }
            if (!this._parent) { return this }

            if (this._parent.phase < this.phases.show) { this._parent.show() }

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


        
        // this.assign = function(parent, name, orderindex) {
        //     this._parent = parent
        //     this._name = name

        //     this._parent = parent || _.dom.page
        //     this._parent._childinsert(this, name, orderindex)

        //     this.setdirty()
        //     this._phase = this.phases.assigned

        //     return this
        // }

        this.left = _.model.number(1)
        this.top = _.model.number(1)
        this.width = _.model.number(60)
        this.height = _.model.number(20)


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

        //     this.scrolllef = _.model.domstyle("scrollLeft")
        //     this.scrolltop = _.model.domstyle("scrollTop")
        //     this.scrollwidth = _.model.domstyle("scrollWidth")
        //     this.scrollheight = _.model.domstyle("scrollHeight")
            
        //     //value: absolute, relative, fixed, static
        //     this.position = _.model.domstyle("position")
        //     this.overflowx = _.model.domstyle("overflowX")
        //     this.overflowy = _.model.domstyle("overflowY")
        //     this.display = _.model.domstyle("display")
        //     this.float = _.model.domstyle("float")
        //     this.clear = _.model.domstyle("clear")
        //     this.order = _.model.domstyle("order")
        //     this.zindex = _.model.domstyle("zIndex")
        // })

        // this.flexbehavior = _.behavior(function() {
        //     this.flex = _.model.domstyle("flex")
        //     this.flexdirection = _.model.domstyle("flexDirection")
        //     this.flexwrap = _.model.domstyle("flexWrap")
        //     this.flexflow = _.model.domstyle("flexFlow")
        //     this.justifycontent = _.model.domstyle("justifyContent")
        //     this.alignitems = _.model.domstyle("alignItems")
        //     this.aligncontent = _.model.domstyle("alignContent")
        //     this.alignself = _.model.domstyle("alignSelf")
        //     this.flexbasis = _.model.domstyle("flexBasis")
        //     this.flexgrow = _.model.domstyle("flexGrow")
        //     this.flexshrink = _.model.domstyle("flexShrink")
        //     this.flex = _.model.domstyle("flex")
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
        //     this.textalign = _.model.domstyle("textAlign")
        //     this.textdecoration = _.model.domstyle("textDecoration")
        //     this.texttransform = _.model.domstyle("textTransform")
        //     this.textindent = _.model.domstyle("textIndent")
        //     this.textoverflow = _.model.domstyle("textOverflow")
        //     this.textshadow = _.model.domstyle("textShadow")
        //     this.textstrokecolor = _.model.domstyle("webkitTextStrokeColor")
        //     this.textfillcolor = _.model.domstyle("webkitTextFillColor")
        //     this.textstrokewidth = _.model.domstyle("webkitTextStrokeWidth")
        //     this.wordwrap = _.model.domstyle("wordWrap")
        //     this.whitespace = _.model.domstyle("whiteSpace")
        //     this.printcoloradjust = _.model.domstyle("printColorAdjust")
        // })

        // this.borderbehavior = _.behavior(function() {
        //     this.border = _.model.domstyle("border")
        //     this.borderleftcolor = _.model.domstyle("borderLeftColor")
        //     this.borderleftwidth = _.model.domstyle("borderLeftWidth")
        //     this.borderleftstyle = _.model.domstyle("borderLeftStyle")
        //     this.bordertopcolor = _.model.domstyle("borderTopColor")
        //     this.bordertopwidth = _.model.domstyle("borderTopWidth")
        //     this.bordertopstyle = _.model.domstyle("borderTopStyle")
        //     this.borderrightcolor = _.model.domstyle("borderRightColor")
        //     this.borderrightwidth = _.model.domstyle("borderRightWidth")
        //     this.borderrightstyle = _.model.domstyle("borderRightStyle")
        //     this.borderbottomcolor = _.model.domstyle("borderBottomColor")
        //     this.borderbottomwidth = _.model.domstyle("borderBottomWidth")
        //     this.borderbottomstyle = _.model.domstyle("borderBottomStyle")
            
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
            
        //     this.borderradius = _.model.domstyle("borderRadius")
        //     this.bordertopleftradius = _.model.domstyle("borderTopLeftRadius")
        //     this.bordertoprightradius = _.model.domstyle("borderTopRightRadius")
        //     this.borderbottomrightradius = _.model.domstyle("borderBottomRightRadius")
        //     this.borderbottomleftradius = _.model.domstyle("borderBottomLeftRadius")
            
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