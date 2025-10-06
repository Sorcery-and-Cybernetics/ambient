//todo: state as calculated values

_.define.enum("controlstate", ["none", "destroyed", "destroying", "creating", "created", "loading", "loaded", "showing", "showed", "drawing", "painting"])
_.define.enum("viewportmode", ["normal", "never", "always", "dom"])
_.define.enum("layout", ["horizontal", "vertical", "grid", "pixel"])


//make.button(form.content, "bla")

//form.add("button", "bla")
//form.inner.$


_.define.alias("block", function (supermodel) {
    return {
        newstyle: null

        , name: _.property("")
        , controlstate: _.property(_.enum.controlstate.none)
        , tagname: _.property("DIV")
        , tagtype: _.property("")

        , viewportmode: _.property(_.enum.viewportmode.normal).options(_.enum.viewportmode)
        , layout: _.property(_.enum.layout.horizontal).options(_.enum.layout)

        , gutterwidth: _.property(0)
        , gutterheight: _.property(0)

        , margintop: _.property(0)
        , marginleft: _.property(0)
        , marginright: _.property(0)
        , marginbottom: _.property(0)

        , left: _.property(4)
        , top: _.property(4)
        , width: _.property(60)
        , height: _.property(20)

        , zorder: _.property(0)

        , create: function () {
            supermodel.create.apply(this, arguments)

            this.controlstate(_.enum.controlstate.creating)

            this.newstyle = {}
            this.controlstate = this.controlstates.created
        }

        , domhook: function (domelement) {
            this.__fixed = true //todo: better var name?
            this.element = domelement
            this.tagname(this.element.tagName)
            this.tagtype(this.element.type)

            this._parent = null

            //this._parent = _.dom.control(relative.parentElement._uid) || _.dom.page
            _.dom.registercontrol(this)
        }

        , domunhook: function () {
            //todo: 
        }

        , load: function () {
            this.controlstate = this.controlstates.loading
            //if (this._parent && !this.root) {
            //    this.root = this._parent.root || this._parent
            //}
            this.controlstate = this.controlstates.loaded
            if (this.viewportmode == this.viewportmodes.never) { this.__domcreate() }
            if (this.onload) { this.onload() }
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

        , __flush: function() { 
            //todo: 
        }

        , __domattach: function () {
            //todo: 
        }

        , __domunattach: function () {
            //todo: 
        }

        , paint: function (force) {
            var index;
            var child;
            var dirty = this.dirty

            if (this.controlstate < this.controlstates.showed) { this.show() }

            this.controlstate = this.controlstates.drawing

            this.__domcreate()

            if ((dirty & 1) && this.ondraw) {
                this.ondraw()
            }

            this.controlstate = this.controlstates.painting
            this.dirty = 0;

            //todo: Update coordinates, formulas and animations
            //            if (!this.inviewport()) { return this.__domdestroy() }

            //var childcount = 0
            //var dirtychildcount = 0

            this.foreachcontrol(function (child) {
                if (child._parent == this) { //Check if child is a contained control
                    if (dirty & 2) {
                        child.dirty |= 1
                    }
                    if (child.dirty && (child._parent == this)) {
                        child.paint();
                    }
                }
            })

            if (dirty & 1) {
                if (this.onpaint) {
                    this.onpaint()
                }
                this.__flush(true)
            }

            this.controlstate = this.controlstates.showed
            return this;
        }

        , ondestroy: _.signal()
        , onhide: _.signal()
        , onclick: _.signal()
        , onsize: _.signal()

        , onmousedown: _.signal()
        , onmouseup: _.signal()
        , onmousemove: _.signal()
        , onmouseenter: _.signal()
        , onmouseleave: _.signal()

        , onfocus: _.signal()
        , onblur: _.signal()
        , onselect: _.signal()
        , onchange: _.signal()
        , onresize: _.signal()
        , onkeydown: _.signal()
        , onkeyup: _.signal()
    }
})
