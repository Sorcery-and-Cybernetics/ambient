//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

//todo: Update calculations to 1 base
//todo: Update to true a modelvalue

_.ambient.module("rect", function(_) {
    _.area = {
        center: 0
        , middle: 0

        , left: 1
        , leftmiddle: 1 + 16
        , middleleft: 1 + 16

        , right: 2
        , rightmiddle: 1 + 16
        , middleright: 1 + 16

        , top: 4
        , centertop: 4 + 32
        , topcenter: 4 + 32

        , bottom: 8
        , centerbottom: 8 + 32
        , bottomcenter: 8 + 32

        , lefttop: 5
        , topleft: 5

        , righttop: 6
        , topright: 6

        , leftbottom: 9
        , bottomleft: 9

        , rightbottom: 10
        , bottomright: 10

        , all: 15

        , center: 16
        , middle: 32

        , truecenter: 48
        , centermiddle: 48
        , middlecenter: 48
    }

//_.areavalue = (function () {
//    var result = {}

//    _.foreach(_.area, function (value, key) {
//        result[key] = value
//    })

//    return result
//}())

    _.define.modelvalue("rect", function () {
        var getxalign = function (area) {
            return (area & 3) || _.area.center
        }

        var getyalign = function (area) {
            return (area & 12) || _.area.middle
        }

        this.x = _.model.property(0)
        this.y = _.model.property(0)
        this.width = _.model.property(0)
        this.height = _.model.property(0)

        this.construct = function (x, y, width, height) {
            this.x(x || 0)
            this.y(y || 0)
            this.width(width || 0)
            this.height(height || 0)
        }

        this.right = function (value) {
            if (value === undefined) { return this.x() + this.width() - 1 }

            this.x(value - (this.width() - 1))
            return this
        }

        this.bottom = function (value) {
            if (value !== undefined) { return this.y() + this.height() - 1 }

            this.y(value - (this.height() - 1))
            return this
        }

        this.center = function () {
            return this.x() + ((this.width() - 1) >> 1)
        }

        this.middle = function () {
            return this.y() + ((this.height() - 1) >> 1)
        }

        this.clone = function () {
            return _.model.rect(this.x(), this.y(), this.width(), this.height())
        }

        this.setrect = function (rect) {
            this.construct(rect.x, rect.y, rect.width, rect.height)
            return this
        }

        this.posadd = function (x, y) {
            if (x instanceof _.model.rect) {
                this.x(this.x() + x.x())
                this.y(this.y() + x.y())
            } else {
                this.x(this.x() + x)
                this.y(this.y() + y)
            }
            return this
        }

        this.possub = function (x, y) {
            if (x instanceof _.model.rect) {
                this.x(this.x() - x.x())
                this.y(this.y() - x.y())
            } else {
                this.x(this.x() - x)
                this.y(this.y() - y)
            }
            return this
        }

        this.sizeadd = function (x, y) {
            if (x instanceof _.model.rect) {
                this.width(this.width() + x.width())
                this.height(this.height() + x.height())
            } else {
                this.width(this.width() + (x || 0))
                this.height(this.height() + (y || 0))
            }
            return this
        }

        this.sizesub = function (x, y) {
            if (x instanceof _.model.rect) {
                this.width(this.width() - x.width())
                this.height(this.height() - x.height())
            } else {
                this.width(this.width() - (x || 0))
                this.height(this.height() - (y || 0))
            }
            return this
        }

        this.toscreen = function (containerrect) {
            this.posadd(containerrect)
            return this
        }

        this.tocontainer = function (containerrect) {
            this.possub(containerrect)
            return this
        }

        this.hit = function (x, y, margin) {
            margin = margin || 0
            var result = !((x < (this.x() - margin)) || (y < (this.y() - margin)) || (x >= (this.x() + this.width() + margin)) || (y >= (this.y() + this.height() + margin)))
            
            return result
        }

        this.borderhit = function (x, y, margin) {
            margin = margin || 0

            var result = (Math.abs(this.x() - x) < margin ? _.area.left : 0)
            result += (Math.abs(this.y() - y) < margin ? _.area.top : 0)
            result += (Math.abs(this.right() - x) < margin ? _.area.right : 0)
            result += (Math.abs(this.bottom() - y) < margin ? _.area.bottom : 0)
            return result
        }

        this.areahit = function (x, y, centerwidth, centerheight) {
            var result = 0

            centerwidth = centerwidth || 0
            centerheight = centerheight || 0

            x -= this.x()
            y -= this.y()

            marginhor = (this.width() - centerwidth) / 2
            marginvert = (this.height() - centerheight) / 2

            if ((x >= 0) && (x <= this.width())) {
                if (x < marginhor) {
                    result += _.area.left
                } else if (x <= (this.width() - marginhor)) {
                    result += _.area.center
                } else {
                    result += _.area.right
                }
            }

            if ((y >= 0) && (y <= this.height())) {
                if (y < marginvert) {
                    result += _.area.top
                } else if (y <= (this.height() - marginvert)) {
                    result += _.area.middle
                } else {
                    result += _.area.bottom
                }
            }
            return result
        }

        this.inviewscore = function (rect) {
            var result = 0
            var right = this.right()
            var bottom = this.bottom()

            if (_.inbetween(rect.x(), this.x(), right)) { result += 1 }
            if (_.inbetween(rect.y(), this.y(), bottom)) { result += 1 }
            if (_.inbetween(rect.right(), this.x(), right)) { result += 1 }
            if (_.inbetween(rect.bottom(), this.y(), bottom)) { result += 1 }
            return result
        }

        this._xarea = function (area) {
            switch (getxalign(area)) {
                case _.area.left: return this.x()
                case _.area.center: return this.center()
                case _.area.right: return this.right()
            }
        }

        this._yarea = function (area) {
            switch (getyalign(area)) {
                case _.area.top: return this.y()
                case _.area.middle: return this.middle()
                case _.area.bottom: return this.bottom()
            }
        }

        this.getpoint = function (area) {
            return _.model.point(this._xarea(), this._yarea())
        }

        this.calculaterelativefit = function (relativerect, relativealign, selfalign, containerrect) {
            var result = _.model.rect(
                relativerect.xarea(relativealign) + (this.x() - this._xarea(selfalign))
                , relativerect.yarea(relativealign) + (this.y() - this._yarea(selfalign))
                , this.width()
                , this.height()
            )

            if (containerrect && (containerrect.inviewscore(result) != 4)) {
                return false
            } else {
                return true
            }
        }

        this.calculaterelative = function (relativerect, relativealign, selfalign, containerrect) {
            var result = _.model.rect(
                relativerect.xarea(relativealign)  - this._xarea(selfalign)
                , relativerect.yarea(relativealign) - this._yarea(selfalign)
                , this.width()
                , this.height()
            )

            if (containerrect) {
                if (!_.inbetween(result.x(), containerrect.x(), containerrect.right())) {
                    result.x(containerrect.x())
                } else if (!_.inbetween(result.right(), containerrect.x(), containerrect.right())) {
                    result.right(containerrect.right())
                    if (result.x() < containerrect.x()) { result.x(containerrect.x()) }
                }

                if (!_.inbetween(result.y(), containerrect.y(), containerrect.bottom())) {
                    result.y(containerrect.y())
                } else if (!_.inbetween(result.bottom(), containerrect.y(), containerrect.bottom())) {
                    result.bottom(containerrect.bottom())
                    if (result.y() < containerrect.y()) { result.y(containerrect.y()) }
                }
            }

            return result
        }
    })
})