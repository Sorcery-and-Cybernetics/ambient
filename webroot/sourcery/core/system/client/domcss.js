//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

//Todo: Speed up - merge dirty and current. Default style are globally grouped in config, and lazy prerendered during first time use.
//todo: add support for attributes and properties
//todo: add support for animations and formulas
//todo: emulate padding for absolute positioning
//todo: current style should have a different class than the predefined styles.

_.ambient.module("domcss", function(_) {

    _.define.object("controlstyle", function () {
        this.construct = function (control) {
            this.control = control
        }
    })

    _.define.object("controlstyleclass", function () {
        this.construct = function (control, classname, css) {
            var styleclasses = control.currentstyle.styleclasses
            var styleclass = styleclasses[classname] || (styleclasses[classname] = _.shallowclone(control.__styleclasses[classname] || {}))

            this.control = control
            this.classname = classname
            this.styleclass = styleclass

            if (css) {
                this.css(css)
            }
            return this
        }

        this.css = function (css) {
            _.foreach(_.normalize(css, this), function (item, key) {
                this[key.toLowerCase()].apply(this, _.isarray(item) ? item : [item])
            }, this)

            return this
        }

        this.updateactivestyle = function (name) {
            var def = _.css[name]

            var currentstyle = this.control.currentstyle
            var classes = currentstyle.styleclasses
            var actives = classes.activeclasses
            var updated
            var styleclass
            var classname

            var updated = classes.current ? classes.current[name] : null

            if (updated === null || updated === undefined) {
                var index = classes.classnames.length

                while (index--) {
                    classname = classes.classnames[index]

                    if (actives[classname]) {
                        styleclass = classes[classname] || this.control.__styleclasses[classname]
                        if (styleclass && (styleclass[name] != null)) { updated = styleclass[name]; break }
                    }
                }
            }

            if (def && currentstyle[name] !== updated) {
                //todo: Anything that influences position and/or size should be handled seperately. 
                var trigger = "dirty" + (def.trigger || "")
                var dirty = currentstyle[trigger] || (currentstyle[trigger] = [])

                dirty.push(name)
                currentstyle[name] = updated

                this.control.setdirty()
            }

            return this
        }

        this.active = function (value) {
            var activeclasses = this.control.currentstyle.styleclasses.activeclasses

            if (value == null) {
                return (this.classname == "current") || !!activeclasses[this.classname]
            }
            if (!!activeclasses[this.classname] != value) {
                activeclasses[this.classname] = value

                for (var name in this.styleclass) {
                    this.updateactivestyle(name)
                }
                this.raise("classchange", this.control)

                //if (this.control.onstatechange) {
                //    this.control.onstatechange(this.classname, value)
                //}
            }
            return this
        }

        this.toggleactive = function () {
            return this.active(!this.active())
        }

        //todo: Following functions should become part of styleclass
        this.move = function (left, top, width, height, right, bottom) {
            var css = this

            if (left instanceof _.model.rect) {
                css.left(left.x)
                css.top(left.y)
                css.width(left.width)
                css.height(left.height)
            } else {
                css.left(left)
                css.top(top)
                css.width(width)
                css.height(height)

                css.right(right)
                css.bottom(bottom)
            }
            return this
        }

        this.setposition = function (left, top, width, height) {
            var right = 0
            var bottom = 0

            if (width < 0) {
                right = width * -1
                width = 0
            }

            if (height < 0) {
                bottom = height * -1
                bottom = 0
            }
            return this.move(left, top, width, right, bottom)
        }

        this.setborder = function (border, color, width, style) {
            var css = this

            color = _.cstr(color)
            style = style || "solid";
            width = width || (color ? 1 : 0)

            if (border & _.area.left) {
                css.borderleftcolor(color)
                css.borderleftwidth(width)
                css.borderleftstyle(style)
            }

            if (border & _.area.top) {
                css.bordertopcolor(color)
                css.bordertopwidth(width)
                css.bordertopstyle(style)
            }

            if (border & _.area.right) {
                css.borderrightcolor(color)
                css.borderrightwidth(width)
                css.borderrightstyle(style)
            }

            if (border & _.area.bottom) {
                css.borderbottomcolor(color)
                css.borderbottomwidth(width)
                css.borderbottomstyle(style)
            }
            return this;
        }

        this.setmargin = function (left, top, right, bottom) {
            var gapmod = _.config.ui.layout.gap || 1
            var css = this

            if (left != null) { css.marginleft(left * gapmod) }
            if (top != null) { css.margintop(top * gapmod) }
            if (right != null) { css.marginright(right * gapmod) }
            if (bottom != null) { css.marginbottom(bottom * gapmod) }
            return this
        }

        this.setpadding = function (left, top, right, bottom) {
            var gapmod = _.config.ui.layout.gap || 1
            var css = this

            if (left != null) { css.paddingleft(left * gapmod) }
            if (top != null) { css.paddingtop(top * gapmod) }
            if (right != null) { css.paddingright(right == "auto" ? "auto" : right * gapmod) }
            if (bottom != null) { css.paddingbottom(left == "auto" ? "auto" : bottom * gapmod) }
            return this
        }

        this.setborderradius = function (topleft, topright, bottomright, bottomleft) {
            var radiusmod = _.config.ui.layout.borderradius || 1
            var css = this

            if (topleft != null) { css.bordertopleftradius(topleft * radiusmod) }
            if (topright != null) { css.bordertoprightradius(topright * radiusmod) }
            if (bottomright != null) { css.borderbottomrightradius(bottomright * radiusmod) }
            if (bottomleft != null) { css.borderbottomleftradius(bottomleft * radiusmod) }
            return this
        }

        this.setshadow = function (x, y, spread, blur, inner, color, add) {
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

        this.dropshadow = function (x, y, blur, color) {
            var css = this.styleclass
            css.dropshadow = _.merge(css.translate || {}, { x: x || 0, y: y || 0, blur: blur, color: color })
            return this.filtermatrix()
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

        this.translate = function (x, y, z) {
            var css = this.styleclass

            css.translate = _.merge(css.translate || {}, { x: x || 0, y: y || 0, z: z || 0 })
            return this.transformmatrix()
        }
        this.scale = function (x, y, z) {
            var css = this.styleclass

            css.scale = _.merge(css.scale || {}, { x: x || 0, y: y || 0, z: z || 0 })
            return this.transformmatrix()
        }

        this.rotate = function (angle) {
            var css = this.styleclass
            if (angle == undefined) {
                return css.rotate ? css.rotate.z : 0 || 0
            }
            return this.rotate3d(null, null, angle)
            //css.rotate = _.merge(css.rotate || {}, { angle: angle })
            //this.transformmatrix()
        }

        this.rotatex = function (angle) {
            var css = this.styleclass
            if (angle == undefined) {
                return css.rotate ? css.rotate.x : 0 || 0
            }
            return this.rotate3d(angle)
        }

        this.rotatey = function (angle) {
            var css = this.styleclass
            if (angle == undefined) {
                return css.rotate ? css.rotate.y : 0 || 0
            }
            return this.rotate3d(null, angle)
        }

        this.rotatez = function (angle) {
            var css = this.styleclass
            if (angle == undefined) {
                return css.rotate ? css.rotate.z : 0 || 0
            }
            return this.rotate3d(null, null, angle)
        }

        this.rotate3d = function (x, y, z) {
            var css = this.styleclass
            css.rotate = _.merge(css.rotate || {}, { x: x, y: y, z: z })
            this.transformmatrix()
            return this
        }

        this.skew = function (x, y, z) {
            var css = this.styleclass
            css.skew = _.merge(css.scale || {}, { x: x || 0, y: y || 0, z: z || 0 })
            return this.transformmatrix()
        }

        this.transformmatrix = function (translate, rotate, scale, skew) {
            var css = this.styleclass
            var style = ""
            var hastranslate = (css.translate && (css.translate.x != 0 || css.translate.y != 0 || css.translate.z != 0))
                
            if (hastranslate) { style += "translate3d(" + css.translate.x * _.dom.pixelratio + "px," + css.translate.y * _.dom.pixelratio + "px" + "," + css.translate.z + "px" + ") " }
            if (css.scale) { style += "scale(" + css.scale.x + "," + css.scale.y + "" + ") " }
            if (css.rotate) {
                if (css.rotate.x != null) { style += "rotateX(" + css.rotate.x + "deg" + ") " }
                if (css.rotate.y != null) { style += "rotateY(" + css.rotate.y + "deg" + ") " }
                if (css.rotate.z != null) { style += "rotateZ(" + css.rotate.z + "deg" + ") " }
                //                style += "rotate(" + css.rotate.angle + "deg" + ") "
            }
            //            if (css.rotate) { style += "rotate3d(" + css.rotate.x + "deg," + css.rotate.y + "deg" + ") " }
            if (css.skew) { style += "skew(" + css.skew.x + "px," + css.skew.y + "px" + ") " }

            return this.transform(style || "none")
        }

        //filter: none | blur() | brightness() | contrast() | drop-shadow() | grayscale() | hue-rotate() | invert() | opacity() | saturate() | sepia() | url();
        this.filtermatrix = function (dropshadow) {
            var css = this.styleclass
            var style = ""
    
            if (css.dropshadow) { style += "drop-shadow(" + css.dropshadow.x * _.dom.pixelratio + "px " + css.dropshadow.y * _.dom.pixelratio + "px " + +css.dropshadow.blur * _.dom.pixelratio + "px " + css.dropshadow.color + ") " }

            return this.filter(style || "none")
        }
    })
    .onload(function () {
        var controlstyleclass = _.model.controlstyleclass.prototype

        // _.dom.__testarea = _.dom.createelement("DIV")
        // _.dom.appendelement(_.dom.__testarea)
        // var css = _.dom.__testarea.style

        // css.positon = "absolute"
        // css.positon.left = -10000
        // css.positon.top = -10000
        // css.positon.width = 2000
        // css.positon.height = 2000

        // _.dom.__testdiv = _.dom.createelement("DIV")
        // _.dom.appendelement(_.dom.__testdiv, _.dom.__testarea)


        var createstyleproperty = function (stylename) {
            return function (value) {
                if (value === undefined) {
                    var result = this.classname == "current" ? this.control.currentstyle[stylename] : this.styleclass[stylename]
                    if (!result) {
                        var node = this.control._parent
                        while (node) {
                            if (node.currentstyle[stylename] !== undefined) {
                                return node.currentstyle[stylename]
                            }
                            node = node._parent
                        }
                    }
                    return result
                }
                //todo: check for triggers -> updateactivestyle
                //todo: check for special syntax  --> updateactivestyle
                if (value === null || value === undefined) { return this }

                if (this.styleclass[stylename] !== value) {
                    this.styleclass[stylename] = value

                    if (this.active()) {
                        this.updateactivestyle(stylename)
                    }
                }
                return this
            }
        }

        //Create a list of css functions
        _.css = (function () {
            var __cssprefixes = ["", "ms", "webkit", "moz", "o", "ms-", "webkit-", "-webkit-", "moz-", "o-"]

            var __css = {
                "left": { type: "metric", parenttrigger: "move" }
                , "top": { type: "metric", parenttrigger: "move" }
                , "width": { type: "metric", trigger: "size" }
                , "height": { type: "metric", trigger: "size" }
                , "right": { type: "metric", parenttrigger: "move" }
                , "bottom": { type: "metric", parenttrigger: "move" }

                , "overflow": { type: "overflow" }
                , "overflow-x": { type: "overflow", inherit: "overflow" }
                , "overflow-y": { type: "overflow", inherit: "overflow" }
                , "position": { type: "position" }
                , "float": { type: "float", test: ["css", "style"] }
                , "clear": { type: "clear" }
                , "display": { type: "display" }
                , "margin": { type: "metric", sides: "ltrb" }
                , "padding": { type: "metric", sides: "ltrb" }
                , "visibility": { type: "visibility" }
                , "order": { type: "number" }
                , "z-index": { type: "number" }

                , "cursor": { type: "cursor", group: "appearance" }
                , "background": {}
                , "background-color": { type: "color" }
                , "background-repeat": { type: "bgrepeat" }
                , "background-image": { type: "image" }
                , "background-attachment": { type: "text" }
                , "background-position": { type: "text" }
                , "background-size": { type: "text" }
                , "background-blend-mode": { type: "text" }
                , "background-clip": { type: "text", test: __cssprefixes }

                , "opacity": { test: "prefix" }

                , "border": { type: "border", sides: "ltrb" }
                , "border-style": { type: "borderstyle", sides: "ltrb" }
                , "border-color": { type: "color", sides: "ltrb" }
                , "border-width": { type: "metric", sides: "ltrb" }

                , "border-radius": { type: "metric", test: __cssprefixes, sides: ["", "top-left", "top-right", "bottom-right", "bottom-left"] }

                , "color": { type: "color", group: "text" }
                , "font-family": { type: "cssfont", trigger: "autosize" }
                , "font-size": { type: "metric", trigger: "autosize" }
                , "font-weight": { type: "fontweight" }
                , "font-height": { type: "metric", trigger: "autosize" }
                , "font-variant": { type: "fontvariant" }
                , "letter-spacing": { type: "metric" }
                , "font-style": { type: "fontstyle" }
                , "line-height": { type: "metric", trigger: "autosize" }

                , "text-align": { type: "textalign" }
                , "text-decoration": { type: "textdecoration" }
                , "text-transform": { type: "texttransform" }
                , "text-indent": { type: "metric" }
                , "text-overflow": {}
                , "text-shadow": { test: __cssprefixes }
                , "text-stroke-color": { test: __cssprefixes }
                , "text-stroke-width": { type: "metric", test: __cssprefixes }

                //DMI: added for mask text, not yet supported
                , "text-fill-color": { type: "color", test: __cssprefixes }
                , "word-wrap": { type: "wordwrap" }
                , "white-space": { type: "whitespace" }
                , "text-overflow": { type: "textoverflow" }

                , "touch-action": { type: "touchaction" }
                , "break-inside": { type: "breakinside" }
                , "print-color-adjust": { type: "printcoloradjust", test: __cssprefixes }

                , "vertical-align": {}
                , "border-collapse": {}
                , "border-spacing": {}
                , "box-shadow": { test: __cssprefixes }
                , "blur": { test: __cssprefixes }
                , "box-sizing": { test: __cssprefixes }
                , "transition": { test: __cssprefixes }
                , "transition-timing-function": { test: __cssprefixes }

                , "transform": { type: "transform", test: __cssprefixes }
                , "filter": { type: "filter", test: __cssprefixes }
                , "transform-origin": { type: "text", test: __cssprefixes }
                , "transform-style": { type: "text", test: __cssprefixes }
                , "backface-visibility": { type: "text", test: __cssprefixes }
                , "perspective": { type: "metric", test: __cssprefixes }
                , "zoom": { type: "number", test: __cssprefixes }

                , "appearance": { test: __cssprefixes }
                , "user-select": { test: __cssprefixes }
                , "resize": { test: __cssprefixes }

                , "text-anchor": {}
                , "stroke-width": {}
                , "stroke": {}
                , "fill": {}
                //                , "rotate": {}


            }

            var css = {}
            for (var index in __css) {
                var item = __css[index]

                var sides = item.sides || []
                if (sides == "ltrb") { sides = ["left", "top", "right", "bottom"] }

                //Todo: complete rewrite. 
                for (var sideindex = -1; sideindex < sides.length; sideindex++) {
                    var namesplit = _.split$(index, "-")
                    var side = _.cstr(sides[sideindex])

                    if (side) {
                        var newname = _.array.insert(namesplit, 1, _.split$(side, "-"))
                    } else {
                        var newname = namesplit
                    }

                    var fnname = newname.join("")
                    var capitalizedname = newname[0]


                    //Todo: use get and setattribute for testing
                    for (var i = 1; i < newname.length; i++) {
                        capitalizedname += _.capitalize(newname[i])
                    }
                    var style = {}

                    if (capitalizedname == "textStroke") {
                        var x = 10
                    }

                    if (item && (item.test)) {
                        if (_.isarray(item.test)) {
                            capitalizedname = _.dom.findprefixedmethod(capitalizedname, _.dom.__testdiv.style, item.test)
                        }
                    }

                    var cssname = newname.join("-")
                    var stylename = newname.join("")

                    css[stylename] = {
                        jsname: capitalizedname
                        , cssname: _.join$(newname, "-")
                        , ismetric: item.type == "metric"
                        , iscss: true
                        , isattribute: false
                        , trigger: item.trigger
                    }

                    controlstyleclass[stylename] = createstyleproperty(stylename)
                }
            }

            var __attributes = {
                "html": { jsname: "innerHTML", trigger: "autosize"}
                , "textarearows": { jsname: "rows", trigger: "autosize" }
                , "text": { jsname: "textContent", trigger: "autosize" }
                , "nosnippet": { jsname: "data-nosnippet", istoggle: true }
                , "disabled": { jsname: "disabled", istoggle: true }
                , "src": { jsname: "src" }
                , "href": { jsname: "href" }
                , "target": { jsname: "target" }
                , "value": { jsname: "value", trigger: "autosize" }
                , "scrollx": { jsname: "scrollLeft"}
                , "scrolly": { jsname: "scrollTop"}
                , "frameborder": { jsname: "frameBorder" }
                , "sandbox": { jsname: "sandbox" }
                , "title": { jsname: "title" }

                , "viewbox": { jsname: "viewBox" }
                , "x": {}
                , "y": {}
                , "rectwidth": { jsname: "width" }
                , "rectheight": { jsname: "height" }
                , "x1": {}
                , "y1": {}
                , "x2": {}
                , "y2": {}
                , "cx": {}
                , "cy": {}
                , "r": {}
                , "d": {}
                , "dx": {}
                , "dy": {}
                , "rx": {}
                , "ry": {}
                , "fillrule": { jsname: "fill-rule" }
            }

            for (var name in __attributes) {
                var attrib = __attributes[name]
                css[name] = {
                    jsname: attrib.jsname || name
                    , isattribute: true
                    , trigger: attrib.trigger
                    , isinline : attrib.isinline
                }
                controlstyleclass[name] = createstyleproperty(name)
            }

            return css
        })()

    })


})
