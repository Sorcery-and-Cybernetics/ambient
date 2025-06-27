//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("dombody", function(_) {
    _.define.control("documentbody", function (supermodel) {
        this.styleclasses = {
            "default": {
                width: 320
                , height: 568
                , fontsize: _.config.ui.fontsize.normal
                , fontfamily: _.config.ui.layout.fontfamily
                , userselect: "none"
                , backgroundcolor: _.config.ui.colour.pageback
                , color: _.config.ui.colour.pagefore
            }
        }
        this.width = 0
        this.height = 0
        this.minheight = _.config.ui.layout.minheight || 800
        this.debug = false
        this.isroot = true
        this.rescale = false

       
        this.autozoom = function () {
            if (!_.config.ui.layout.autozoom) {
                this.width = _.dom.programwidth
                this.height = _.dom.programheight || this.outerheight()

                this.size(this.width, this.height )

                return
            }

            var pagewidth = _.dom.programwidth
            var pageheight = _.dom.programheight

            var hzoom = _.dom.pagewidth() / pagewidth

            var maxzoom = _.config.ui.layout.maxzoom || 3
            hzoom = Math.min(hzoom, maxzoom)

            if (pageheight) {
                var vzoom = _.dom.pageheight() / pageheight
            } else {
                pageheight = _.dom.pageheight() / hzoom

                if (pageheight < this.minheight) {
                    var vzoom = _.dom.pageheight() / this.minheight
                    hzoom = vzoom
                    pageheight = this.minheight
                } else {
                    var vzoom = hzoom
                }
            }

            var zoom = hzoom
        
            //Test double coordinates
            this.move((_.dom.pagewidth() - pagewidth * zoom) / (2 * _.dom.pixelratio))
            _.dom.zoomfactor = zoom / _.dom.pixelratio

            //this.move((_.dom.pagewidth() - pagewidth * zoom) / 2)
            //_.dom.zoomfactor = zoom

            this.width = pagewidth

            //            if (_.dom.orientation() == "portrait") {
            //              this.width = appwidth
            //              this.height = Math.floor(_.dom.pageheight() / _.dom.zoomfactor)
            //           } else {
            //              this.width = Math.floor(_.dom.pagewidth() / _.dom.zoomfactor)
            //              this.height = appheight
            //           }
            //          
            //this.width = Math.floor(_.dom.pagewidth() / _.dom.zoomfactor)
            //this.height = Math.floor(_.dom.pageheight() / _.dom.zoomfactor)

            this.size(pagewidth, pageheight)

            _.dom.page.scale(_.dom.zoomfactor, _.dom.zoomfactor)
            _.dom.page.css({ transformorigin: "left top" })
        }

        this.onresize = _.signal(function (event) {
            this.autozoom()

            this.foreachcontrol(function (ctrl) {
                var style = ctrl.style()

                if (((style.right() !== null) || (style.bottom() !== null))) {
                    ctrl.paint(undefined, true)
                }
            })

            if (event.force) {
                this.setdirty(2)
            }
        })
        

        this.onload = function () {
            this.size(_.config.ui.layout.pagewidth, _.config.ui.layout.pageheight)
            this.css({ overflow: "hidden" })

            if (this.debug) {
                _.make.label(this, "lbldebuginfo")
                    .move(0, 2, 320, 20)
                    .css({ zindex: 1000, color: _.config.ui.colour.fore, backgroundcolor: _.config.ui.colour.back, fontsize: _.config.ui.fontsize.small })
            }

            this.behavior(_.efb.mousemove)
            this.autozoom()
        }

        this.findcontrol = function (path, childindex) {
            //Todo: Add support for controlarrays and add to control class
            var control = this
            var index
            var name
            path = path.split(".")


            for (var index = 0; index < path.length; index++) {
                name = path[index]
                if (_.isarray(control)) {
                    control = control[name]
                } else {
                    control = control.control[name]
                }
                if (control == null) { break }
            }


            if (childindex && control) {
                control = control[childindex - 1]
            }

            return control
        }


        this.outerleft = function (value) {
            if (value === undefined) {
                //this.__flush(true)

                return 0 // this.currentstyle.left || (this.element ? this.element.offsetLeft / _.dom.pixelratio : 0)
            }
            this.style("current").left(value)
            return this
        }

        this.outertop = function (value) {
            if (value === undefined) {
                //this.__flush(true)

                return 0 //this.currentstyle.top || (this.element ? this.element.offsetTop / _.dom.pixelratio : 0)
            }
            this.style("current").top(value)
            return this
        }

        this.onpaint = function () {
            this.currentstyle.scrollx = _.dom.scrollx
            this.currentstyle.scrolly = _.dom.scrolly

            if (this.lbldebuginfo) {
                this.lbldebuginfo.value(_.dom.debuginfo)
            }
        }

        this.onmousemove = function (event) {
            //if (this.debug) {
            //    var x = Math.round(event.mouse.x)
            //    var y = Math.round(event.mouse.y)

            //    var debuginfo = "x: " + x + " y: " + y

//                this.lbldebuginfo.value(debuginfo)
            //}
        }

        this.ondestroy = function () {
            _.debug("THE END....")
        }
    })
})



