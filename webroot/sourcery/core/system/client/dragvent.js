//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("dragevent", function(_) {

    _.define.enum("dragstate", ["none", "initial", "start", "active", "ended", "cancelled"])


    _.define.event("dragevent", function () {
        this.state = 0
        this.start = {
            mouse: null
            , rect: null
        }
        this.mouse = null
        this.mod = null
        this.scroll = null
        this.button = null
        this.source = null
        this.dragroot = null
        this.droptarget = null
        this.automove = false //todo: replace this for behavior
        
        this.create = function (mousedrag, name, event) {
            var el = mousedrag.element

            this.source = mousedrag
            this.dragroot = mousedrag.dragroot || mousedrag

            this.start = {
                mouse: _.model.rect(event.mouse.x, event.mouse.y)
                , rect: this.dragroot.absoluteouterrect()
                , scrollrect: this.dragroot._parent.scrollrect() //todo: better naming. Scrollrect return scroll left and scroll top as a kind.rect
            }

            this.mouse = this.start.mouse.clone()
            this.mod = _.model.rect(0, 0)

            this.scroll = _.model.rect(el.scrollLeft, el.scrollTop)
            this.automove = !!(mousedrag._behavior & _.efb.drag)

            if (event.name == "mousedown") {
                this.state = _.enum.dragstate.initial
                this.name = "dragstart"
            }

            this.update(event)
        }

        this.update = function (event) {
            var mousedrag = this.source

            this.mouse = _.model.rect(event.mouse.x, event.mouse.y)

            if (mousedrag._behavior & _.efb.size) {
                this.selectedborder = (this.start.rect.borderhit(this.mouse.x, this.mouse.y, 4) & mousedrag.__sizable)
            } else {
                this.selectedborder = 0
            }

            this.button = event.button
        }

        this.cancelevent = function () {
            this.modx = 0
            this.mody = 0

            this.state = _.enum.dragstate.cancelled
            this.droptarget = null
            this.cancelled = true

            return this
        }

        this.mousemove = function (event) {
            this.mouse = _.model.rect(event.mouse.x, event.mouse.y)
            this.calc(event.mouse.x - this.start.mouse.x, event.mouse.y - this.start.mouse.y)
        }

        this.calc = function (modx, mody) {
            if (modx == null) { modx = this.mod.x }
            if (mody == null) { mody = this.mod.y }

            var mousedrag = this.dragroot

            if (this.state == _.enum.dragstate.initial) {
                var mod = Math.max(Math.abs(modx), Math.abs(mody))

                if (this.selectedborder) {
                    this.name = "size"
                    this.state = _.enum.dragstate.start //todo: moved
                } else if (!(this.source._behavior & _.efb.click) || (mod >= 4)) {
                    this.name = "drag"
                    this.state = _.enum.dragstate.start
                }
            }

            if (this.state == _.enum.dragstate.initial) {
                this.mod.x = 0
                this.mod.y = 0
                return
            }

            if (this.selectedborder) {
                this.mod = _.model.rect(0, 0, 0, 0)
                var parentpos = mousedrag._parent.absoluteouterrect()

                this.newpos = this.start.rect.clone().posadd(-parentpos.x, -parentpos.y)

                if (this.selectedborder & _.area.left) {
                    if (this.start.rect.width - modx < 16) { modx = this.start.rect.width - 16 }
                    this.newpos.x += modx
                    this.newpos.width = this.start.rect.width - modx
                    this.mod.x = modx
                }

                if (this.selectedborder & _.area.top) {
                    if (this.start.rect.height - mody < 16) { mody = this.start.rect.height - 16 }
                    this.newpos.y += mody
                    this.newpos.height = this.start.rect.height - mody
                    this.mod.y = mody
                }

                if (this.selectedborder & _.area.right) {
                    if (this.start.rect.width + modx < 16) { modx = -(this.start.rect.width - 16) }
                    this.newpos.width = this.start.rect.width + modx
                    this.mod.width = modx
                }

                if (this.selectedborder & _.area.bottom) {
                    if (this.start.rect.height + mody < 16) { mody = -(this.start.rect.height - 16) }
                    this.newpos.height = this.start.rect.height + mody
                    this.mod.height = mody
                }

            } else {
                //Todo: this shouldn't be here

                if (this.automove) {
                    this.newpos = this.start.rect.clone()
                        .possub(this.dragroot._parent.absoluteouterrect())
                        .possub(this.start.scrollrect)
                        .posadd(this.dragroot._parent.scrollrect())
                        .posadd(_.model.rect(modx, mody))

                } else {

                    this.newpos = _.model.rect(
                        _.limitbetween(this.scroll.x - modx, 0, mousedrag.element.scrollWidth - 1)
                        , _.limitbetween(this.scroll.y - mody, 0, mousedrag.element.scrollHeight - 1)
                        , this.start.rect.width
                        , this.start.rect.height
                    )
                }
            }
            this.mod.x = modx
            this.mod.y = mody
        }

        this.startposition = function () {
            return this.start.rect.clone().possub(this.dragroot._parent.absoluteouterrect())
        }

        this.getrelativemouse = function (ctrl) {
            return _.model.rect(this.mouse.x, this.mouse.y).possub(ctrl.absoluteouterrect())
        }
    })
})

