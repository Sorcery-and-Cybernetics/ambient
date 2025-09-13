//Todo: A control has 2 parents. Parent is the most direct container a control is in. Root is the container most logically to contain application logic (aka: pages/popups/usercontrols).
//Todo: Extend oop inheritance with object merging
//todo: Styles/properties can have 2 values: formula and value. 
//todo: extend styleclasses with attributes, user properties and functions
//todo: emulate padding for absolute positioning

//todo: auto classtags - control.activeclasses

//todo: instead parent/control and root => parent/child and group/member (partof or memberof)

//implement: scrollx, scrolly or modx and mody


_.define.defextender.property("defextender.layout", function() {

    return {
        create: function (initial, onset, onget, onchange) {
            this._initial = initial
            this._onset = onset
            this._onget = onget
            this._onchange = onchange
        }

        , define: function (proto, layoutname) {
            var me = this
            me._parent = proto

            return function (value) {
                var currentvalue = this._layout[layoutname] || me._initial

                if (value == undefined) {
                    return currentvalue
                }

                if (currentvalue != value) {
                    this._layout[layoutname] = value
                }
                return this
            }
        }
    }
})


_.define.defextender("defextender.styleproperty", {
    create: function (stylename) {
        this._stylename = stylename
    }

    , define: function (proto, name) {
        this._parent = proto
        var stylename = this._stylename

        return function (value) {
            //var currentvalue = domattribute && this.element ? this.element[domattribute] : this.currentstyle[domattribute]

            var currentvalue = this.currentstyle[stylename]

            if (value !== undefined) {
                if (currentvalue != value) {
                    var style = this.style()
                    style[stylename](value)
                }
                //                if (preferdom && this.element) { this.element[name] = value }
                return this
            } else {
                return currentvalue
            }
        }
    }
})

_.define.kind("childfunctionstate", function (supermodel) {
    return {
        functionname: ""
        , arguments: null

        , create: function (functionname, args) {
            this.functionname = functionname
            this.arguments = args
        }
    }
})

_.define.defextender("defextender.childfunction", {
    create: function (initial, childname, functionname) {
        this._initial = initial
        this._childname = childname
        this._propertyname = propertyname
    }

    , define: function (proto, name) {
        this._parent = proto
        this.name = name

        var childname = this._childname
        var functionname = this._functionname || name

        return function () {
            var child = this[childname] 
                
            if (child) {
                child[functionname].apply(child, arguments)

            } else {
                if (!this._state) { this._state = {} }

                child = this._state[childname]
                if (!child) {
                    child = {}
                    this._state[childname] = child
                }
                var child = this[childname]

                child[functionname] = _.make.childfunctionstate(functionname, arguments)
            }
        }
    }
})

//todo: dom.pixelratio
_.cunit = function (coord, units) {
    units = units || "px"
    if ((coord == null) || (coord == "")) { return coord }
    var result = _.cstr(coord)
    var length = result.length

    if (length > 0) {
        var charcode = result.charCodeAt(length - 1);
        if ((charcode >= 48) && (charcode <= 57)) { result += units; }
    }
    return result;
}

var namesplit = function (name, delimiter) {
    var pos = name.lastIndexOf(delimiter || "#")
    if (pos >= 0) {
        var value = name.substring(pos + 1)
        return result = {
            key: name.substring(0, pos)
           , value: parseInt(value) || 0
        }
    } else {
        return { key: name, value: null }
    }
}

//Base control
_.define.kind("control", function () {
    //_.enum.showmode = _.buildenum(["normal", "screen", "popup", "compound"])

    _.define.enum("controlstate", ["destroyed", "destroying", "none", "creating", "created", "loading", "loaded", "showing", "showed", "drawing", "painting"], -2)
    _.define.enum("viewportmode", ["strict", "window", "never"])

    var controlarray = {
        reindex: function (controls, index) {
            //            index++
            for (; index <= controls.length; index++) {
                var control = controls[index - 1]
                control.orderindex = index
            }
        }
    }

    function forlist(me, list, fn) {
        _.foreach(list, function (item, index) {
            var result = fn.call(me, item, item.orderindex || 0)

            switch (result) {
                case _.done:
                    return _.done
                    break

                case _.remove:
                    item.destroy()
                    break
            }
        })
    }

    var updateclasstags = function (control) {
        if (!control.element) { return }

        //control.activeclasses = ""
        //_.foreach(control.currentstyle.styleclasses.activeclasses, function (classname) {
        //    if (classname != "default") {
        //        control.activeclasses += " " + classname
        //    }
        //})
        if (control.element) {
            control.element.className = control.__kindname + " " + this.name // + " " + (control.activeclasses? control.name + control.activeclasses: "")
        }
    }

    var forcontrolarray = function (self, name, from, to, list) {
        var control = self.control[name]

        if (!control) {
            return self
        } else if (control.constructor == Array) {
            if (from <= 0) { from = control.length - from }
            if (to <= 0) { to = control.length - to }

            var direction = from <= to ? 1 : -1
            for (var index = from; index <= to; index += direction) {
                list.push(control[index - 1])
                //var result = fn.call(self, control[index - 1], index)
                //if (result == _.done) { return result }
            }
        } else {
            if ((from == 1) || (to == 1)) {
                list.push(control)
                //var result = fn.call(self, control)
                //if (result == _.done) { return result }
            }
        }
    }

    return {
        _value: null
        , _self: null

        , name: ""
        , isroot: false
        , orderindex: 0
        , id: 0
        , controlstate: 0
        , controlstates: _.enum.controlstate
        , behaviors: _.efb
        , $: null
        , control: null
        , parent: _.property()
        , root: null
        , tagname: "DIV"
        , tagtype: ""
        , viewportmode: 0
        , viewportmodes: _.enum.viewportmode
        , dirty: 0
        , __anim: undefined
        , __timers: undefined
        , __sizable: _.area.all
        , tag: _.property("")

        , related: _.property()
        , smartlayout: _.property(false)

        , styleclasses: {
            "default": {
                visibility: ""
                // , position: "absolute"
                , margin: "0px"
                , padding: "0px"
                , boxsizing: "border-box"
                //                , lineheight: "120%"
                , cursor: "inherit"
                , overflow: "hidden"
                , disabled: false
                , printcoloradjust: "exact"

                //, $: {
                //    captionbar: {
                //        default: {
                //            color: "yellow"
                //        }
                //        , highlight: {
                //            color: "blue"
                //        }
                //    }
                //}
            }

            , "hidden": {
                visibility: "hidden"
            }
            , "highlight": {
            }
            , "disabled": {
                disabled: true

                //, $: {
                //    captionbar: {
                //        default: {
                //            color: "grey"
                //        }
                //    }
                //}
            }

            //, "captionbar": {
            //    default: {}
            //    , hidden: {}

            //    , "title": {
            //        color: "white"
            //        , fontweight: "bold"
            //    }
            //    , "icon": {
            //        left: 2
            //        , top: 2
            //    }


            //}
        }

        , state: null
        , loadmode: _.property(_.enum.loadmode.full)

        , styles: null
        , version: _.property(0)
        , currentstyle: null

        , gadget: _.property()
        , theme: _.property()
        , navigateto: _.property()

        , gettheme: function () {
            var key = this.theme()
            if (key || !this._parent) {
                var theme = _.config.ui[key] || _.config.ui.product_theme
                var parent = this._parent ? this._parent.gettheme() : {}
                return _.json.merge(parent, theme)
            } else {
                return this._parent.gettheme()
            }
        }
        //todo: 
        //, behavior: _.make.trait(0)
        , _behavior: 0
        , behavior: function (value) {
            if (value === undefined) { return this._behavior }

            this._behavior = value
            return this
        }
        , uid: function () {
            if (!this._uid) {
                _.dom.registercontrol(this)
            }
            return this._uid
        }

        , addbehavior: function (value) { this.behavior(this._behavior | value); return this }
        , delbehavior: function (value) { this.behavior(this._behavior & ~value); return this }

        , create: function (relative, name, orderindex) {
            if (_.isstring(relative)) { throw "Component Create Error" }
            if (!_.isstring(name)) { throw "Component Create Error" }

            this.controlstate = this.controlstates.creating
            this.name = name

            ////Initialize element
            if (relative && !relative.__kindname) { //(_.iselement(relative)) {
                //Relative is an existing dom element
                this.__fixed = true //todo: better var name?
                this.element = relative
                this.tagname = this.element.tagName
                this.tagtype = this.element.type
                this._parent = _.dom.control(relative.parentElement._uid) || _.dom.page
                _.dom.registercontrol(this)
                if (this._parent) { this._parent.__childinsert(this, name, orderindex) }
            } else {
                this._parent = relative !== undefined ? relative || _.dom.page : null
                if (this._parent) { this._parent.__childinsert(this, name, orderindex) }
            }

            //Initialize styles
            //todo: this could go into onobjectcreation (or maybe once for each page)
            if (!this._parent) {
                this.root = null
                this.__styleclasses = this.styleclasses
            } else {
                var styling = _.clone(this.styleclasses || {})

                var parentkindstyle = this._parent.styleclasses[this.__kindname]
                var parentnamestyle = this._parent.styleclasses[this.name]

                if (this._parent.isroot) {
                    this.root = this._parent

                } else {
                    this.root = this._parent.root

                    var rootkindstyle = this.root.styleclasses[this.__kindname]
                    var rootnamestyle = this.root.styleclasses[this.name]
                }

                if (parentkindstyle) { _.merge(styling, parentkindstyle) }
                if (rootkindstyle) { _.merge(styling, rootkindstyle) }
                if (parentnamestyle) { _.merge(styling, parentnamestyle) }
                if (rootnamestyle) { _.merge(styling, rootnamestyle) }

                this.__styleclasses = styling
            }

            this.currentstyle = _.json.shallowclone(this.__styleclasses.default)
            this.currentstyle.dirty = Object.keys(this.__styleclasses.default)

            this.currentstyle.styleclasses = {
                classnames: Object.keys(this.__styleclasses)
                , activeclasses: { "default": true }
            }

            if (this.__fixed) {
                //this.currentstyle.left = this.element.offsetLeft
                //this.currentstyle.top = this.element.offsetTop
                //this.currentstyle.width = this.element.offsetWidth
                //this.currentstyle.height = this.element.offsetHeight
                var el = this.element
                this.move(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight)
            }

            this.$ = {}
            this.control = {}
            //            this.data = {}
            this.setdirty()
            this.controlstate = this.controlstates.created

            this.css({ position: "absolute" })

            this._layout = {}

            this.oncreate()
        }

        , db: function () {
            return null
        }

        , addnode: function (item) {
            if (this._state) {
                var state = this._state[item.name]
                if (state) {
                    _.foreach(state, function (value, propertyname) {
                        if (value instanceof _.kind.childfunctionstate) {
                            child[value.functionname].apply(child, value.arguments)
                        } else {
                            _.setprop(child, propertyname, value)
                        }
                    })

                    delete this._state[item.name]
                }
            }
        }

        , changeorderindex: function (neworderindex) {
            _.array.changeindex(this._parent[this.name], this.orderindex, neworderindex)
            return this
        }

        , load: function () {
            this.controlstate = this.controlstates.loading
            //if (this._parent && !this.root) {
            //    this.root = this._parent.root || this._parent

            //}

            if (this.viewportmode == this.viewportmodes.never) { this.__domcreate() }
            if (this.onload) { this.onload() }
            this.controlstate = this.controlstates.loaded
            return this
        }

        //, style: function(stylename, css) {
        //    var stylename = stylename || "default"
        //    var style = this.styleclasses[stylename] || _.make.controlstyleclass(this, stylename)
        //    if (css) {
        //        style.css(css)
        //        return this
        //    }
        //    return style
        //}

        , style: function (stylename, css, value) {
            var stylename = stylename || "current"
            var style = _.make.controlstyleclass(this, stylename)

            if (!css) { return style }

            if (_.isobject(css)) {
                style.css(css)
                return this
            }

            if (!value) { return style[css] }
            style[css](value)
            return this
        }

        , __flush: function (flushall) {

            var flush = function (control, listname) {
                var dirty = control.currentstyle[listname]

                for (var index = 0; index < dirty.length; index++) {
                    var name = dirty[index]

                    var def = _.css[name]
                    var value = control.currentstyle[name]

                    if (_.isfunction(value)) { value = value(control) }
                    //            if (def.onflush) { value = def.onflush(control, value) }

                    if (def.ismetric) {
                        if (!value) {
                            //nop
                        } else if (_.isnumber(value)) {
                            value = value * _.dom.pixelratio
                        }
                        //todo: dom.pixelratio
                        value = _.cunit(value)
                    }

                    if (control.namespace) {
                        if (def.isattribute) {
                            control.element.setAttribute(def.jsname, value)

                        } if (def.iscss) {
                            control.element.style[def.jsname] = value
                        }

                    } else if (def.iscss) {
                        control.element.style[def.jsname] = value

                    } else if (def.isattribute) {
                        if (def.istoggle) {
                            if (value) {
                                control.element.setAttribute(def.jsname, value)
                            } else {
                                control.element.removeAttribute(def.jsname, value)
                            }
                        } else if (def.isinline) {
                            control.element.setAttribute(def.jsname, value)
                        } else {
                            control.element[def.jsname] = value
                        }
                    }
                }
                delete control.currentstyle[listname]
            }

            if ((this.element)) {
                var calclayout = false

                //if ((this.element && this.element.style)) {
                if (this.currentstyle.dirtysize) {
                    flush(this, "dirtysize")
                    calclayout = true
                    if (this._parent) { this._parent.setdirty() }
                }

                if (this.currentstyle.dirtyautosize) {

                    if (!this.currentstyle.height) {
                        switch (this.currentstyle.display) {
                            case "none":
                            case "hidden":
                                //this.element.style.display = this.currentstyle.display
                                break

                            default:
                                this.element.style.display = ((this.currentstyle.width !== undefined) || (this.currentstyle.right !== undefined)) ? "block" : "inline"    //Or --> outerheight = (this.currentstyle.lineheight || this.currentstyle.fontsize) + this.currentstyle.paddingtop + this.currentstyle.paddingbottom + this.currentstyle.margintop + this.currentstyle.marginbottom + this.currentstyle.padding.top + this.currentstyle.padding.bottom
                        }
                    }
                    flush(this, "dirtyautosize")
                    calclayout = true

                    if (this._parent) { this._parent.setdirty() }
                }

                if (calclayout && this.smartlayout()) {
                    this.calclayout()
                }

                if (flushall && this.currentstyle.dirty) {
                    flush(this, "dirty")
                }

                //this.currentstyle.outerleft = this.currentstyle.left || 0 //|| this.element.offsetLeft
                //this.currentstyle.outertop = this.currentstyle.top || 0 //|| this.element.offsetTop
                //this.currentstyle.outerwidth = this.currentstyle.width || this.element.offsetWidth
                //this.currentstyle.outerheight = this.currentstyle.height || this.element.offsetHeight

            } else {
                //todo: prerender offscreen?
            }
        }

        , layoutbehavior: _.behavior({
            calclayout: function () {
                var panelwidth = this._parent.innerwidth()
                var panelheight = this._parent.innerheight()

                var posx = this.posx()
                var posy = this.posy()

                var sizex = this.sizex() || this.innerwidth()
                var sizey = this.sizey() || this.innerheight()

                if (posx < 0) { posx = panelwidth + posx }
                if (posy < 0) { posy = panelheight + posy }

                var xalign = this.align() & 3
                var yalign = this.align() & 12

                //Calculate x-layout
                switch (xalign) {
                    case _.area.center:
                        if (sizex <= 0) {
                            sizex = panelwidth + (sizex * 2)
                        }

                        if (posx == 0) {
                            posx = 1 + (panelwidth - sizex) / 2
                        } else {
                            posx = posx - (sizex / 2)
                        }

                        break

                    case _.area.left:

                        if (posx == 0) { posx = 1 }

                        if (sizex <= 0) {
                            sizex = panelwidth - posx + 1 + sizex
                        }

                        break

                    case _.area.right:

                        if (posx == 0) { posx = panelwidth }

                        if (sizex <= 0) {
                            sizex = posx + sizex
                        }

                        posx = posx - sizex + 1
                        break
                }

                //calculate y-layout
                switch (yalign) {
                    case _.area.middle:
                        if (sizey <= 0) {
                            sizey = panelheight + (sizey * 2)
                        }

                        if (posy == 0) {
                            posy = 1 + (panelheight - sizey) / 2
                        } else {
                            posy = posy - (sizey / 2)
                        }

                        break

                    case _.area.top:

                        if (posy == 0) { posy = 1 }

                        if (sizey <= 0) {
                            sizey = panelheight - posy + 1 + sizey
                        }

                        break

                    case _.area.bottom:

                        if (posy == 0) { posy = panelheight }

                        if (sizey <= 0) {
                            sizey = posy + sizey
                        }

                        posy = posy - sizey + 1
                        break
                }

                this.move(posx - 1, posy - 1, sizex, sizey)
            }

            , align: _.property(0)

            , posx: _.property(0)
            , posy: _.property(0)

            , sizex: _.property(0)
            , sizey: _.property(0)

            , shiftx: _.property(0)
            , shifty: _.property(0)

            , autoheight: _.property(false)
            , autowidth: _.property(false)

            , setpos: function (posx, posy, sizex, sizey, align, shiftx, shifty) {
                if (posx != null) { this.posx(posx) }
                if (posy != null) { this.posy(posy) }
                if (align != null) { this.align(align) }
                if (sizex != null) { this.sizex(sizex) }
                if (sizey != null) { this.sizey(sizey) }
                if (shiftx != null) { this.shiftx(shiftx) }
                if (shifty != null) { this.shifty(shifty) }
            }

            , setsize: function (sizex, sizey, align) {
                if (sizex != null) { this.sizex(sizex) }
                if (sizey != null) { this.sizey(sizey) }
                if (align != null) { this.align(align) }
            }
        })

        , show: function () {
            if (this.controlstate < this.controlstates.loaded) {
                this.load()
            }
            this.controlstate = this.controlstates.showing
            return this
        }

        , hide: function () {
            //todo: implement. For now it is just a stub for inherited kinds
//            this.css({ "visibility", "hidden")
        }

        , disabled: function (value) {
            if (value == null) { return this.hasclass("disabled") }

            this.setclass("disabled", value)

            this.foreachcontrol(function (control) {
                control.disabled(value)
            })
            return this
        }

        , paint: function (force, resizing) {
            var me = this

            if (this.destroyed()) {
                //todo: sometimes the paint gets called after control destrol 
                return this
            }
            var dirty = this.dirty

//            _.debug("Paint" + this.fulldebugpath() + " (" + this.__kindname + ")")

            force = force || !!(this.dirty & 2)

            if (this.controlstate < this.controlstates.showed) {
                if (this.controlstate < this.controlstates.loaded) { this.load() }

                _.aliashelper.updatextrait(this, this.xtrait())

                //todo: remove next line in version v2. Show will be nothing more than a stub to set initial values, or to turn on visibility = true
                if (this.controlstate < this.controlstates.showing) { this.show() }

                this.onshow()
            }

            //Andrew: Wat gaat er mis als ik dit weg haal???
            //if (force || (this.controlstate < this.controlstates.showed)) {
            //    force = true

            //    _.aliashelper.updatextrait(this, this.xtrait())
            //    this.onshow()
            //}

            this.__domcreate()

            this.controlstate = this.controlstates.drawing

            if ((force || (this.dirty & 1)) && this.ondraw) {
                this.ondraw()
            }

            this.controlstate = this.controlstates.painting

            this.dirty = 0

            var maxwidth = 0
            var maxheight = 0

            this.foreachcontrol(function (child) {
                if (child.dirty || force) {
                    child.paint(force, resizing)

                    //if (me.dirty) {
                    //    _.debug("New dirty" + child.fulldebugpath() + " (" + child.__kindname + ")" )
                    //}
                } else if (resizing) {
                    var childstyle = child.style()

                    if ((childstyle.right() != null) || (childstyle.bottom() != null)) {
                        child.paint(undefined, resizing)
                    }
                }
            })

            if (this.onpaint) { this.onpaint() }

            if (this.dirty) {
                this.dirty = 0

                this.foreachcontrol(function (child) {
                    if (child.dirty) {
//todo: just flushing should be enough
//                        child.__flush()
                        child.paint()

                        //if (me.dirty) {
                        //    _.debug(child.fullname() + " just dirtied " + me.fullname())
                        //}
                    }
                })
            }

            this.__flush(true)

            if (this.dirty) {
                //todo: this should not be happening
                if (this.onpaint) {
                    this.onpaint()
                }
                _.debug("Still dirty: " + this.__kindname + " - " + this.fullname())
                this.dirty = 0
            }

            this.controlstate = this.controlstates.showed

            return this;
        }


        //, addclass: function (name) {
        //    if (name == "current") { return this }
        //    if (this.hasclass(name)) { return this }

        //    var style = this.style(name)
        //    style.active(true)

        //    updateclasstags(this)
        //    return this
        //}

        //, removeclass: function (name) {
        //    if (name == "current") { return this }

        //    var style = this.style(name)
        //    style.active(false)

        //    updateclasstags(this)
        //    return this
        //}

        , setclass: function (name, value) {
            if (name == "current") { return this }

            var style = this.style(name)
            if (value != null) {
                style.active(!!value)
            } else {
                style.toggleactive()
            }

            updateclasstags(this)
            //todo: for some unknown reason this is commented out
            //this.setdirty()
            return this
        }

        , hasclass: function (name) {
            return !!this.currentstyle.styleclasses.activeclasses[name]
        }

        , copyclasses: function (control) {
            var orig = control.currentstyle.styleclasses.activeclasses
            var target = this.currentstyle.styleclasses.activeclasses

            this.foreach(target, function (styleclass, name) {
                if (!orig[name]) {
                    this.setclass(name, false)
                }
            })

            this.foreach(orig, function (styleclass, name) {
                if (!target[name]) {
                    this.setclass(name, true)
                }
            })
        }

        , anim: function (name) {
            if (!this.__anim) {
                this.__anim = _.make.animgroup(this)

                if (!this.element) {
                    this.__anim.pauseall()
                }
            }

            return this.__anim.item(name)
        }

        , timer: function (name) {
            if (!this.__timers) { this.__timers = {} }

            var timer = this.__timers[name]
            if (!timer) {
                timer = _.timer.gettimer(this, name)
                this.__timers[name] = timer
            }
            return timer
        }

        , hastimer: function (name) {
            if (!this.__timers) { return false }

            var timer = this.__timers[name]
            return !!timer
        }

        , getrelation: function (relationname) {
            return (relationname ? (this[relationname]() || this._parent) : this._parent)
        }

        , hasancestor: function (ctrl, relationname) {
            var cursor = this;

            while (cursor) {
                if (cursor == ctrl) {
                    return true;
                }
                cursor = cursor.getrelation(relationname)
            }
            return false;
        }

        , findsharedancestor: function (ctrl, relationname) {
            var path1 = this.ancestorpath(null, relationname);
            var path2 = ctrl ? ctrl.ancestorpath(null, relationname) : [];

            if ((path1.length == 0) || (path2.length == 0)) {
                return null;
            }

            var result = null;
            var length = Math.min(path1.length, path2.length)

            for (var index = 0; index < length; index++) {
                if (path1[index] == path2[index]) {
                    result = path1[index];
                }
            }
            return result;
        }

        , ancestorpath: function (ancestor, relationname) {
            var result = [];
            var cursor = this

            while (cursor) {
                result.unshift(cursor);

                if (cursor == ancestor) { return result }
                cursor = cursor.getrelation(relationname)
            }
            return result;
        }

        //, path: function(delimiter) {
        //    return _.join$(this.ancestorpath(), delimiter || "/")
        //}

        , fullname: function () {
            return this.name + (this.orderindex ? "#" + this.orderindex : "")
        }

        , fulldebugname: function () {
            return (this._parent? this._parent.fullname() + "-" : "") + this.fullname()
        }

        , fulldebugpath: function () {
            return (this._parent ? this._parent.fulldebugpath() + "-" : "") + this.fullname()
        }


        , __childinsert: function (child, name, orderindex) {
            //todo: add support for adding multiple childs at the same time. Possibilities: child is an array (count = child.length). Child is a control, and will be cloned count -1 times.
            //child.name = name

            if (orderindex != null) {
                var controls = this.control[name]
                if (!controls) {
                    controls = this.control[name] = []
                    if (!this[name]) { this[name] = controls }
                }

                if (orderindex < 0) { orderindex = controls.length - orderindex }
                if ((orderindex < 0) || (orderindex > controls.length)) { orderindex = 0 }

                if (orderindex == 0) {
                    controls.push(child)
                    child.orderindex = controls.length
                } else {
                    controls.splice(orderindex - 1, 0, child)
                    controlarray.reindex(controls, orderindex)
                }
            } else {
                if (this[name]) {
                    throw name + " already exists in " + parent.name
                }

                this[name] = child
                this.control[name] = child
            }
        }

        , __domcreate: function () {
            if (this.element) { return this }
            if (!this.tagname) { return this }

            if (!this._parent.element) { this._parent.__domcreate() }

            var relative = this._parent

            var appendmode = _.eam.lastchild

            //todo: maybe find a nearest item in the control array. 
            //if (this.orderindex == 1) {
            //    appendmode = _.eam.lastchild
            if (this.orderindex > 1) {
                relative = relative.control[this.name][this.orderindex - 2]
                if (!relative.element) {
                    relative = this._parent

                } else {
                    appendmode = _.eam.after
                }
            }
           
            if (this.navigateto()) {
                this.element = _.dom.createelement("a", null, this.namespace)
                this.css({ "href": this.navigateto(), "target": "_self" })
                //this.element.setAttribute("href", this.navigateto())
                //this.element.setAttribute("target", "_self")
//                this.element.addEventListener("click", function (e) { e.preventDefault(); })
            } else {
                this.element = _.dom.createelement(this.tagname, _.normalize(this.tagtype), this.namespace)
            }

            this.element.className = this.__kindname + " " + this.name //+ " " + this.name + this.activeclasses
            _.dom.appendelement(this.element, relative.element, appendmode)
            
            _.dom.registercontrol(this)

            for (var eventname in this.currentstyle.domevents) {
                _.dom.addevent(this.element, eventname)
            }

            this.__flush(true)

            if (this.ondomcreate) { this.ondomcreate() }

            if (this.__anim) {
                this.__anim.unpauseall()
            }

            if (_.dom.focus() == this) {
                this.setfocus()
            }

            return this
        }

        , __domdestroy: function () {
            if (this.__anim) {
                this.__anim.destroy()
                this.__anim = null
            }

            if (this.__timers) {
                _.foreach(this.__timers, function (timer) {
                    timer.destroy()
                })
                this.__timers = undefined
            }

            if (this.element) {
                for (var eventname in this.currentstyle.domevents) {
                    _.dom.removeevent(this.element, eventname)
                }

                if (!this.__fixed) {

                    //TODO: Discuss andrew; this line causes an stack overflow. 
                    //Disabling will make the tryptych work, but will probably break something else.
                    _.dom.unregistercontrol(this) 

                    if (this.ondomdestroy) { this.ondomdestroy() }
                    _.dom.removeelement(this.element)
                    this.element = null
                }
            }
            return this
        }

        //, changeparent: function (parent, orderindex) {
        //    this.controlstate = this.controlstates.destroyed
        //    this._parent.removechild(this.name, this.orderindex || null, this.orderindex || null)

        //    if (orderindex == null) {
        //        if (_.isarray(parent, this.name)) {
        //            orderindex = 0
        //        }
        //    }
        //    parent.__childinsert(this, this.name, orderindex)

        //    if (this.element) {
        //        if (!this._parent.element) { this._parent.__domcreate() }
        //        _.dom.appendelement(this.element, parent.element)
        //    }
        //}

        , destroy: function () {
            if (this.controlstate == this.controlstates.destroyed) { return null }
            if (this.controlstate >= this.controlstates.created) {
                this.controlstate = this.controlstates.destroying
                if (this._parent) {
                    this._parent.removechild(this.name, this.orderindex || null, this.orderindex || null)
                }
            }

            if (this.ondestroy) { this.ondestroy() }

            if (this._parent) {
                this._parent.setdirty(4)
            }

            if (this.__signals) {
                _.foreach(this.__signals, function (signalbox) {
                    if (signalbox.filtered) {
                        signalbox.filtered.foreach(function (signalstack) {
                            signalstack.destroy()
                        })
                    }

                    if (signalbox.unfiltered) {
                        signalbox.unfiltered.destroy()
                    }
                })
                this.__signals = null
            }

            this.__hooks = null

            this.removechild("*")
            this.__domdestroy()

            //see aliasbase
            if (this._self) {
                var self = this._self._parent
                if (self._parent == this) {
                    self.destroy()
                    self = null
                } else {
                    this._self.destroy()
                    this._self = null
                }
            }

            //this.controlstate = this.controlstates.destroyed
            //this.connectdata()

            this._value = null
            this._parent = null
            this.root = null

            return null
        }

        , destroyed: function () {
            return this.controlstate <= this.controlstates.destroying
        }

        //marinus: so... why does this conflict with the kind evolution? created, but evalution ==0 ?
        , created: function () {
            return this.controlstate >= this.controlstates.created
        }

       , removechild: function (search, from, to) {
           if (from == null) { from = 1 }
           if (to == null) { to = 0 }

           if (search.charAt(search.length - 1) != "*") {
               var control = this.control[search]

               if (!control) {
                   return this
               } else if (control.constructor == Array) {
                   if (from <= 0) { from = control.length - from }
                   if (to <= 0) { to = control.length - to }

                   if (from <= to) {
                       for (var index = from; index <= to; index++) {
                           var current = control[index - 1]
                           if (current.controlstate >= this.controlstates.created) {
                               current.controlstate = this.controlstates.destroying
                               current.destroy()
                           }
                       }

                       if ((from == 1) && (to == control.length)) {
                           if (this[search] == this.control[search]) {
                               delete this[search]
                           }
                           delete this.control[search]
                       } else {
                           control.splice(from - 1, to - from + 1)
                           controlarray.reindex(control, from)
                       }
                   }

               } else {
                   if ((from == 1) || (to == 1)) {
                       if (control.controlstate >= this.controlstates.created) {
                           control.controlstate = this.controlstates.destroying
                           control.destroy()
                       }
                       if (this[search] == this.control[search]) {
                           delete this[search]
                       }
                       delete this.control[search]
                   }
               }
           } else {
               for (var index in this.control) {
                   if (_.match$(index, search)) {
                       this.removechild(index, from, to)
                   }
               }
           }
       }

        , controlcount: function (name) {
            var ctrl = this.findcontrol(name)

            if (!ctrl) {
                return 0
            } else if (_.isarray(ctrl)) {
                return ctrl.length
            } else {
                return 1
            }
        }

        , findbyref: function (refuid) {
            var result = null

            this.foreachcontrol(function (child) {
                if (child.refuid() == refuid) {
                    result = child
                    return _.done
                }
            })

            //recursive addition
            //this.foreachcontrol(function (child) {
            //    child.foreachcontrol(function (cchild) {
            //        var cresult = sub.findbyref(refuid)
            //        if (cresult) {
            //            result = cresult
            //            return _.done
            //        }
            //    })
            //    if (result) {
            //        return _.done
            //    }
            //})
            return result
        }

        , findcontrol: function (name, index) {
            if (!this.control) { return null }

            var result = this.control[name]

            if (_.isarray(result)) {
                if (index < 0) { result = result.length - index + 1 }

                if ((index > 0) && (index <= result.length)) {
                    result = result[index - 1]
                } else {
                    result = null
                }
            }
            return result
        }

        , findcontrols: function (search, from, to) {
            var from = from || 1
            var to = to || 0

            var list = []

            if (search.charAt(search.length - 1) != "*") {
                var result = forcontrolarray(this, search, from, to, list)
                if (result == _.done) { return result }
            } else {
                for (var index in this.control) {
                    if (_.match$(index, search)) {
                        var result = forcontrolarray(this, index, from, to, list)
                        if (result == _.done) { return result }
                    }
                }
            }

            return list
        }

       , forcontrol: function (search, from, to, fn) {
           if (_.isfunction(from)) { fn = from; from = 1; to = 0 }
           else if (_.isfunction(to)) { fn = to; to = 0 }
           else { from = (from == null ? 1 : from); to = to || 0 }

           var list = this.findcontrols(search, from, to)

           forlist(this, list, fn)
           return this
       }

        , foreachcontrol: function (fn) {
            var list = []

            for (var index in this.control) {
                forcontrolarray(this, index, 1, 0, list)
            }

            forlist(this, list, fn)
            return this
        }

        , nextnode: function () {
            if (!this.orderindex) { return null }

            return this._parent[this.name][this.orderindex]
        }

        , prevnode: function () {
            if (!this.orderindex) { return null }

            return this._parent[this.name][this.orderindex - 2]
        }

        , html: _.styleproperty("html")
        //, text: _.attribproperty("textContent")

        //, text: function(value) {
        //    if (value !== undefined) {
        //        value = _.escape$(value)
        //        value = _.replace$(value, "\n", "<br>")
        //        return this.text(value)
        //    } else {
        //        var value = this.text()
        //        value = _.replace$(value, "<br>", "\n")
        //        value = _.unescape$(value)
        //        return value
        //    }
        //}

        , gettextwidth: function (text) {
            var testdiv = _.make.div(this._parent, "testdiv")
            //            var testdiv = _.dom.__testspan
            var savestyle = testdiv.style

            var style = testdiv.style
            var source = this.currentstyle

            if (this.dirty) { this.__flush() }
            
            testdiv.css({
                fontFamily: source.fontfamily
                , fontSize: source.fontsize
                , fontWeight: source.fontweight
            })
            testdiv.show().paint()
            testdiv.size("")

            testdiv.html(text)
            var result = testdiv.innerwidth()

            testdiv.destroy()
            return result
        }

        , css: function (css, value) {
            return this.style("current", css, value)
        }

        , sizable: function (borders) {
            if (borders) {
                this._behavior |= _.efb.size
                this.__sizable = borders
            } else {
                this._behavior &= !_.efb.size
                this.__sizable = 0
            }
            return this;
        }

        , setfocus: function () {
            if (!this.focus) { _.dom.focus(this) }

            if (this.element && this.element.focus && (_.lcase$(this.element.tagName) == "input" || _.lcase$(this.element.tagName) == "textarea" )) {
                this.element.focus()
            }
            return this
        }

        , setchecked: function (value, raiseclick) {
            raiseclick = _.undef(raiseclick, true)

            switch (this._behavior & 15) {
                case _.efb.click:
                case _.efb.normal:
                    break
                case _.efb.stateaction: case _.efb.sac: case _.efb.state:
                    if (this.hasclass("checked") != value) {
                        this.setclass("checked", value)
                        this.setdirty()
                    } else {
                        raiseclick = false
                    }
                    break

                case _.efb.stateoption: case _.efb.stateoptionaction: case _.efb.soc:
                case _.efb.option: case _.efb.optionaction: case _.efb.oac:
                    if (this.hasclass("checked")) {
                        if ((value !== true) && (this._behavior & _.efb.state)) {
                            this.setclass("checked", false)
                            this.setdirty()
                        } else {
                            raiseclick = false
                        }
                    } else {
                        if (value !== false) {
                            if (this.hasclass("checked")) {
                                raiseclick = false
                            } else {
                                this.setclass("checked", true)
                                this.setdirty()
                            }
                        } else {
                            raiseclick = false
                        }
                    }

                    if (this.hasclass("checked") && this.orderindex) {
                        if (this.orderindex) {
                            var orderindex = this.orderindex
                            this._parent.forcontrol(this.name, function (child) {
                                if (child.orderindex != orderindex) {
                                    if (child.hasclass("checked")) {
                                        child.setclass("checked", false)
                                        child.setdirty()
                                    }
                                }
                            })
                        }
                    }
            }

            if (raiseclick) { this.raise("click") }
            return this
        }

        , size: function (width, height) {
            var style = this.style("current")

            var x = style.height()
            style.height(height)
            var x = style.height()

            return this.move(null, null, width, height)
        }

        , borderpaddingleft: function () {
            return (this.currentstyle.paddingleft || 0) + (this.currentstyle.marginleft || 0) + (this.currentstyle.borderleftwidth || 0)
        }

        , borderpaddingtop: function () {
            return (this.currentstyle.paddingtop || 0) + (this.currentstyle.margintop || 0) + (this.currentstyle.bordertopwidth || 0)
        }

        , borderpaddingright: function () {
            return (this.currentstyle.paddingright || 0) + (this.currentstyle.marginright || 0) + (this.currentstyle.borderrightwidth || 0)
        }

        , borderpaddingbottom: function () {
            return (this.currentstyle.paddingbottom || 0) + (this.currentstyle.marginbottom || 0) + (this.currentstyle.borderbottomwidth || 0)
        }

       , innerleft: function (value) {
           if (value === undefined) { return this.outerleft() + this.borderpaddingleft() }
           this.style("current").left(value)
           return this
       }

        , innertop: function (value) {
            if (value === undefined) { return this.outertop() + this.borderpaddingtop() }
            this.style("current").top(value)
            return this
        }

        , innerwidth: function (value) {
            if (value === undefined) { return this.outerwidth() - this.borderpaddingleft() - this.borderpaddingright() }
            this.style("current").width(value)
            return this
        }

        , innerheight: function (value) {
            if (value === undefined) { return this.outerheight() - this.borderpaddingtop() - this.borderpaddingbottom() }
            this.style("current").height(value)
            return this
        }

        , innerright: function () {
            if (value === undefined) { return this.innerleft() + this.innerwidth() }
            return this
        }

        , innerbottom: function (value) {
            if (value === undefined) { return this.innertop() + this.innerheight() }
            return this
        }

        , outerleft: function (value) {
            if (value === undefined) {
                this.__flush(true)

                return _.isnumber(this.currentstyle.left) ? this.currentstyle.left : (this.element ? this.element.offsetLeft / _.dom.pixelratio : 0)
            }
            this.style("current").left(value)
            return this
        }

        , outertop: function (value) {
            if (value === undefined) {
                this.__flush(true)

                return _.isnumber(this.currentstyle.top) ? this.currentstyle.top : (this.element ? this.element.offsetTop / _.dom.pixelratio: 0)
            }
            this.style("current").top(value)
            return this
        }

        , outerwidth: function (value) {
            if (value === undefined) {
                this.__flush(true)

                if ((!this.currentstyle.width) && (this.currentstyle.right != null)) {
                    if (this._parent) {
                        return this._parent.innerwidth() - (this.currentstyle.left || 0) - (this.currentstyle.right || 0)
                    } else {
                        return null
                    }
                    
                }
                return this.currentstyle.width || (this.element ? this.element.offsetWidth / _.dom.pixelratio: 0) || 0
            }

            this.style("current").width(value)
            return this
        }

        , outerheight: function (value) {
            if (value === undefined) {
                this.__flush(true)

                if (this.currentstyle.height == "auto") {
                    return (this.element ? this.element.offsetHeight / _.dom.pixelratio : 0) || 0
                }

                if ((!this.currentstyle.height) && (this.currentstyle.bottom != null)) {
                    return this._parent.outerheight() - (this.currentstyle.top || 0) - (this.currentstyle.bottom || 0)
                }
             
                return this.currentstyle.height || (this.element ? this.element.offsetHeight / _.dom.pixelratio : 0) || 0
            }
            this.style("current").height(value)
            return this
        }

        , outerright: function (value) {
            if (value === undefined) { return this.outerleft() + this.outerwidth() }
            return this
        }

        , outerbottom: function (value) {
            if (value === undefined) { return this.outertop() + this.outerheight() }
            return this
        }

        , outerrect: function (rect) {
            if (!rect) {
                return _.make.rect(this.outerleft(), this.outertop(), this.outerwidth(), this.outerheight())
            }
            this.move(rect.x, rect.y, rect.width, rect.height)
            return this
        }

        , absoluteleft: function (ancestor) {
            var parent = this._parent


            var left = 0
            while (parent && (parent != ancestor)) {
                var outerleft = parent.outerleft()
                if (_.isnumber(outerleft)) {
                    left += outerleft
                } else {
                    var x = 10
                }
                
                if (parent.element) { left -= parent.scrollleft() }
                var parent = parent._parent

            }
            return left + this.outerleft()
        }

        , absolutetop: function (ancestor) {
            var parent = this._parent


            var top = 0
            while (parent && parent != ancestor) {
                top += parent.outertop()
                if (parent.element) {
                    top -= parent.scrolltop()
                }
                var parent = parent._parent

            }
            return top + this.outertop()
        }

        , absoluteright: function (ancestor) {
            return this.absoluteleft(ancestor) + this.outerwidth()
        }

        , absolutebottom: function (ancestor) {
            return this.absolutetop(ancestor) + this.outerheight()
        }

        , scrollleft: function (value) {
            switch (value) {
                case undefined:
                    return _.dom.scrollleft(this.element)

                case null:
                    return this
                default:
                    _.dom.scrollleft(this.element, value)

                    return this
            }
        }

        , scrolltop: function (value) {
            switch (value) {
                case undefined:
                    return _.dom.scrolltop(this.element)

                case null:
                    return this
                default:
                    _.dom.scrolltop(this.element, value)

                    return this
            }
        }

        , scrollrect: function (value) {
            if (!value) {
                return _.make.rect(this.scrollleft(), this.scrolltop(), 0, 0)
            }

            this.scrollleft(value.left)
            this.scrolltop(value.top)
            return this
        }

        , scrollwidth: function () {
            return _.dom.scrollwidth(this.element)
        }

        , scrollheight: function () {
            return _.dom.scrollheight(this.element)
        }

        , findparentscrollbox : function () {
            var ctrl = this

            while (ctrl && ctrl.parent()) {
                ctrl = ctrl.parent()
                if (ctrl.isscrollbox()) {
                    return ctrl
                }
            }
            return null
        }
        , isscrollbox: function () {
            var style = this.currentstyle
            return (style.overflowy == "auto") || (style.overflowy == "scroll")
        }
        , findparent: function (kind) {
            var ctrl = this

            while (ctrl && ctrl.parent()) {
                ctrl = ctrl.parent()
                if (ctrl instanceof _.kind[kind]) {
                    return ctrl
                }
            }
            return null
        }

        , innerrect: function (value) {
            if (!value) {
                return _.make.rect(this.innerleft(), this.innertop(), this.innerwidth(), this.innerheight())
            }
            this.move(rect.x - this.borderpaddingleft(), rect.y - this.borderpaddingtop(), rect.width + this.borderpaddingright() + this.borderpaddingleft(), rect.height + this.borderpaddingbottom() + this.borderpaddingtop())
            return this
        }

        , absoluteouterrect: function (ancestor) {
            return _.make.rect(this.absoluteleft(ancestor), this.absolutetop(ancestor), this.outerwidth(), this.outerheight())
        }

        , absoluteinnerrect: function (ancestor) {
            return _.make.rect(this.absoluteleft(ancestor), this.absolutetop(ancestor), this.innerwidth(), this.innerheight())
        }

        //todo: Following functions should become part of styleclass
        , move: function (left, top, width, height, right, bottom) {
            this.style("current").move(left, top, width, height, right, bottom)
            return this
        }

        , setborder: function (border, color, width, style) {
            this.style("current").setborder(border, color, width, style)
            return this
        }

        , setmargin: function (left, top, right, bottom) {
            this.style("current").setmargin(left, top, right, bottom)
            return this
        }

        , setpadding: function (left, top, right, bottom) {
            this.style("current").setpadding(left, top, right, bottom)
            return this
        }

        , setborderradius: function (topleft, topright, bottomright, bottomleft) {
            this.style("current").setborderradius(topleft, topright, bottomright, bottomleft)
            return this
        }

        , setshadow: function (x, y, spread, blur, inner, color, add) {
            this.style("current").setshadow(x, y, spread, blur, inner, color, add)
            return this
        }

        , dropshadow: function (x, y, blur, color) {
            this.style("current").dropshadow(x, y, blur, color)
            return this
        }

        , setinnershadow: function (x, y, blur, color) {
            this.style("current").setshadow(x, y, 0, blur, true, color)
            return this
        }

        , addinnershadow: function (x, y, blur, color) {
            this.style("current").setshadow(x, y, 0, blur, true, color, true)
            return this
        }

        , setoutershadow: function (x, y, blur, color) {
            this.style("current").setshadow(x, y, 0, blur, false, color)
            return this
        }

        , addoutershadow: function (x, y, blur, color) {
            this.style("current").setshadow(x, y, 0, blur, false, color, true)
            return this
        }

        , setdefaultstyle: function (name) {
            var zoommod = 1
            var flatui = false //this.flatui()

            if (!flatui) {

                switch (name) {
                    //case "innershadow":
                    //    this.setoutershadow(2, 2, 5, "rgba(0, 0, 0, 0.3)")
                    //    break

                    //case "outershadow":
                    //    this.setoutershadow(2, 2, 12, "rgba(0, 0, 0, 0.5)")
                    //    break

                    case "button":
                        this
                            .setinnershadow(1, 1, 2.5 * zoommod, "rgba(255,255,255,0.5)")
                            .addinnershadow(-1, -1, 2.5 * zoommod, "rgba(0,0,0,0.5)")
                            .addoutershadow(1, 1, 2.5 * zoommod, "rgba(0,0,0,0.5)")
                            .setborderradius(4, 4, 4, 4)
                }
            }
            return this
        }

        , translate: function (x, y, z) {
            this.style("current").translate(x, y, z)
            return this
        }
        , scale: function (x, y, z) {
            this.style("current").scale(x, y, z)
            return this
        }

        , rotate: function (angle) {
            if (angle == null) {
                return this.style("current").rotate() || 0
            }
            this.style("current").rotate(angle)
            return this
        }

        , rotatex: function (angle) {
            if (angle == null) {
                return this.style("current").rotatex() || 0
            }
            this.style("current").rotatex(angle)
            return this
        }

        , rotatey: function (angle) {
            if (angle == null) {
                return this.style("current").rotatey() || 0
            }
            this.style("current").rotatey(angle)
            return this
        }

        , rotatez: function (angle) {
            if (angle == null) {
                return this.style("current").rotatez() || 0
            }
            this.style("current").rotatez(angle)
            return this
        }

        , skew: function (x, y, z) {
            this.style("current").skew(x, y, z)
            return this
        }
        , transformmatrix: function (translate, rotate, scale, skew) {
            this.style("current").translate(x, y, z)
            return this
        }

        , opacity: function (value) {
            if (value == null) {
                return this.style("current").opacity()
            }

            this.style("current").opacity(value)
            return this
        }

        , colorback: function (value) {
            if (value == null) {
                return this.style("current").backgroundcolor()
            }

            this.style("current").backgroundcolor(value)
            return this
        }


        //todo: cache parent viewport and limit viewports to the viewport of the parent - maybe it's best to work with absolute position here
        , getviewport: function () {
            var style = this.style
            var rect = _.make.rect(currentstyle.left, currentstyle.top, currentstyle.width, currentstyle.height)

            if (this.element) {
                rect.posadd(_.dom.scrollposition(this.element))
            }
            return rect
        }

        , inviewport: function () {
            if (!this._parent) { return true }
            rect = this.getviewport()
            var parentrect = this._parent.getviewport()

            if (parentrect.inviewscore(rect) > 0) {
                return true
            }

            return false
        }

        , elementsfrompoint: function (x, y, shallow) {
            var result = []
            x = x || 0
            y = y || 0

            x += (this.element ? this.element.scrollLeft : this.currentstyle.scrollleft) || 0
            y += (this.element ? this.element.scrollTop : this.currentstyle.scrolltop) || 0

            this.foreachcontrol(function (control) {
                if (control.innerrect().hit(x, y, 0)) {
                    result.push(control)
                    if (!shallow) {
                        result = result.concat(control.elementsfrompoint(x - control.outerleft(), y - control.outertop()))
                    }
                }
            })
            return result
        }

        , adddomevent: function (eventname) {
            if (!this.currentstyle.domevents) { this.currentstyle.domevents = {} }

            if (this.element && !this.currentstyle.domevents[eventname]) {
                this.currentstyle.domevents[eventname] = true
                _.dom.addevent(this.element, eventname)
            }
            return this
        }

        , removedomevent: function (eventname) {
            if (!this.currentstyle.domevents || !this.currentstyle.domevents[eventname]) { return }
            delete this.currentstyle.domevents[eventname]

            if (this.element) {
                _.dom.removeevent(this.element, eventname)
            }
            return this
        }

        , datadump: function (deep, cloned) {
            var dump = []

            this.foreachcontrol(function (control) {
                if (cloned) {
                    dump.push(_.clone(this.data))
                } else {
                    dump.push(this.data)
                }

                if (deep) {
                    this.items = control.datadump(true)
                }
            })
            return dump
        }


        //todo: Fix Scroll
        , canscrollx: _.property(false, function (value) {
            if (value) {
                this.css({ overflowx: "scroll" })
                this.adddomevent("scroll")
            } else {
                this.css({ overflowx: "hidden" })
            }
        })

        , canscrolly: _.property(false, function (value) {
            if (value) {
                this.css({ overflowy: "scroll" })
                this.adddomevent("scroll")
            } else {
                this.css({ overflowy: "hidden" })
            }
        })
        //DMI: ipv altijd scrolbar tonen alleen tonen indien nodig
        , autoscrollx: _.property(false, function (value) {
            if (value) {
                this.css({ overflowx: "auto" })
                this.adddomevent("scroll")
            } else {
                this.css({ overflowx: "hidden" })
            }
        })
        , autoscrolly: _.property(false, function (value) {
            if (value) {
                this.css({ overflowy: "auto" })
                this.adddomevent("scroll")
            } else {
                this.css({ overflowy: "hidden" })
            }
        })

        , onscroll: _.signal(function () {
            this.currentstyle.scrollx = this.element.scrollLeft
            this.currentstyle.scrolly = this.element.scrollTop
        })



        , oncreate: _.hook()
        , onenter: _.hook()
        , onshow: _.hook()
        , onhide: _.hook()
        , onsize: _.hook()

        , ondestroy: _.signal()
        , onclick: _.signal()
        , ondoubleclick: _.signal()
        , onmousehover: _.signal()

        , onmousedown: _.signal()
        , onmouseup: _.signal()
        , onmousemove: _.signal()
        , onmouseenter: _.signal()
        , onmouseleave: _.signal()

        , onclasschange: _.signal()

        , onfocus: _.signal()
        , onblur: _.signal()
        , onselect: _.signal()
        , onchange: _.signal()
        , onresize: _.signal()

        , onkeydown: _.signal()
        , onkeyup: _.signal()

        , ondrag: _.signal()
        , ondragstart: _.signal()
        , ondragend: _.signal()

        , ondrop: _.signal()
        , ondragover: _.signal()

        , ondata: _.signal()

        //todo: databinding hack
        //, update: function () {
        //    if (this._data && (this._data.value !== undefined) && this.value) {
        //        this.value(this._data.value)
        //    }
        //}

        //see aliasvalue
        , self: function (aliasvalue) {
            //Link aliasvalues to eachother using a linkedlistitem as a link. 
            //source.trait.self ->  link 
            //target.trait.as[] -> link
            //link.value -> source.trait
            //link._parent -> target.trait

            var currentself = (this._self ? this._self._parent : null) || null

            if (aliasvalue === undefined) {
                return currentself
            }

            if (this._value) {
                this.value(null)
            }

            if (currentself != aliasvalue) {
                if (this._self) {
                    this._self.destroy()
                    this._self = undefined
                }

                if (aliasvalue instanceof _.kind.kind) {
                    if (!aliasvalue._as) {
                        aliasvalue._as = _.make.aliasaslist(aliasvalue)
                    }

                    var link = aliasvalue._as.push(this)
                    this._self = link

                    this.updatedirty("change", "self")
                } else if (aliasvalue === null) {
                    this.updatedirty("change", "self")
                } else {
                    this.value(aliasvalue)
                } 
                
            }

            return this
        }

        //see aliasvalue
        , value: function (value) {
            if (value === undefined) {
                if (this._self) {
                    var self = this._self._parent

                    if (self instanceof _.kind.alias) { return self }
                    return self.value()
                } else {
                    return this._value
                }
            }

            if (value instanceof _.kind.alias) {
                if (!this._self) {
                    throw "Mooo"
                    value = value.value()
                }
            } else if (value instanceof _.kind.aliasvalue) {
                value = value.value()
            }

            if (this._self) {
                this._self._parent.value(value)

            } else {
                if (this._value != value) {
                    this._value = value

                    this.updatedirty("change", "value")
                }
            }

            return this
        }

        , xtrait: function (value) {
            if (value === undefined) {
                return this._xtrait
            }

            if (this._xtrait != value) {
                this._xtrait = value

                this.reload()
            }
            return this
        }

        //, getmy: function (name) {
        //    var property = this[name]

        //    return property? _.normalize(property): null
        //}

        , reload: function () {
            //todo: if autoclear on datachange
            if (this.controlstate >= this.controlstates.showed) {
                this.controlstate = this.controlstates.showing

                this.setdirty()
            }
        }

        , refuid: function (value) {
            if (value === undefined) {
                return (this._refuid? this._refuid: (this.self()? this.self()._uid : null))
            }
            this._refuid = value
            return this
        }

        //Dirty mode:
        // < 0 : control is locked
        // 0 : nothing to repaint
        // 1: repaint self
        // 2 : force repaint on all children
        // 4 : repaint child
        , setdirty: function (dirtymode) {
            if (this.dirty < 0) { return }

            //            if (this.dirty != 0) { return }
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

        , updatedirty: function (eventname, traitname) {
            var changeevent = _.make.changeevent(this, eventname, traitname)

            switch (traitname) {
                case "self":
                    this.reload()
                    break
            }
            this.rebond(changeevent)
        }

        , rebond: function (changeevent, silent) {
            switch (changeevent.name) {
                case "changeposition":
                    //Andrew: Wat gebeurd er als ik dit weg haal?
                    //_.aliashelper.updatextrait(this, this.xtrait())
                    this.reload()

                    return

                case "change":
                    var source = changeevent.source

                    switch (changeevent.traitname) {
                        case "self":
                            this.reload()
                            break

                        default:
                            this.onchangevalue()
                            this.setdirty()
                            //nice reload
                    }
                    break

                case "add":
                case "del":
                case "reorder":
                    this.reload()
                    break

            }
            this.onchange(changeevent)
        }

        , model: function () {
            return "control"
        }

        , timerbehavior: _.behavior.timer

        , onchangevalue: _.signal()
        
    }
})


