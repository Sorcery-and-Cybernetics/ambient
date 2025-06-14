//*****************************************************************************************************************
// rect - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

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

    _.getxalign = function (area) {
        return (area & 3) || _.area.center
    }

    _.getyalign = function (area) {
        return (area & 12) || _.area.middle
    }


//_.areavalue = (function () {
//    var result = {}

//    _.foreach(_.area, function (value, key) {
//        result[key] = value
//    })

//    return result
//}())

    _.define.object("rect", function () {
        this._x = _.property(0)
        this._y = _.property(0)
        this._width = _.property(0)
        this._height = _.property(0)

        this.construct = function (x, y, width, height) {
            this._x = x || 0
            this._y = y || 0
            this._width = width || 0
            this._height = height || 0
        }

        this.right = function (value) {
            if (value !== undefined) {
                this._x = value - (this._width - 1)
                return this
            }
            return this._x + this._width - 1
        }

        this.bottom = function (value) {
            if (value !== undefined) {
                this._y = value - (this._height - 1)
                return this
            }
            return this._y + this._height - 1
        }

        this.center = function () {
            return this._x + ((this._width - 1) >> 1)
        }

        this.middle = function () {
            return this._y + ((this._height - 1) >> 1)
        }

        this.clone = function () {
            return _.make.rect(this._x, this._y, this._width, this._height)
        }

        this.setrect = function (rect) {
            this.create(rect.x, rect.y, rect.width, rect.height)
            return this
        }

        this.posadd = function (x, y) {
            if (x instanceof _.kind.rect) {
                this._x += x.x
                this._y += x.y
            } else {
                this._x += x
                this._y += y
            }
            return this
        }

        this.possub = function (x, y) {
            if (x instanceof _.kind.rect) {
                this._x -= x.x
                this._y -= x.y
            } else {
                this._x -= x
                this._y -= y
            }
            return this
        }

        this.sizeadd = function (x, y) {
            if (x instanceof _.kind.rect) {
                this._width += x.width
                this._height += x.height
            } else {
                this._width += (x || 0)
                this._height += (y || 0)
            }
            return this
        }

        this.sizesub = function (x, y) {
            if (x instanceof _.kind.rect) {
                this._width -= x.width
                this._height -= x.height
            } else {
                this._width -= (x || 0)
                this._height -= (y || 0)
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
            var result = !((x < (this._x - margin)) || (y < (this._y - margin)) || (x >= (this._x + this._width + margin)) || (y >= (this._y + this._height + margin)))
            
            return result
        }

        this.borderhit = function (x, y, margin) {
            margin = margin || 0

            var result = (Math.abs(this._x - x) < margin ? _.area.left : 0)
            result += (Math.abs(this._y - y) < margin ? _.area.top : 0)
            result += (Math.abs(this.right() - x) < margin ? _.area.right : 0)
            result += (Math.abs(this.bottom() - y) < margin ? _.area.bottom : 0)
            return result
        }

        this.areahit = function (x, y, centerwidth, centerheight) {
            var result = 0

            centerwidth = centerwidth || 0
            centerheight = centerheight || 0

            x -= this._x
            y -= this._y

            marginhor = (this._width - centerwidth) / 2
            marginvert = (this._height - centerheight) / 2

            if ((x >= 0) && (x <= this._width)) {
                if (x < marginhor) {
                    result += _.area.left
                } else if (x <= (this._width - marginhor)) {
                    result += _.area.center
                } else {
                    result += _.area.right
                }
            }

            if ((y >= 0) && (y <= this._height)) {
                if (y < marginvert) {
                    result += _.area.top
                } else if (y <= (this._height - marginvert)) {
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

            if (_.inbetween(rect.x, this._x, right)) { result += 1 }
            if (_.inbetween(rect.y, this._y, bottom)) { result += 1 }
            if (_.inbetween(rect.right(), this._x, right)) { result += 1 }
            if (_.inbetween(rect.bottom(), this._y, bottom)) { result += 1 }
            return result
        }

        this._xarea = function (area) {
            switch (_.getxalign(area)) {
                case _.area.left: return this._x
                case _.area.center: return this.center()
                case _.area.right: return this.right()
            }
        }

        this._yarea = function (area) {
            switch (_.getyalign(area)) {
                case _.area.top: return this._y
                case _.area.middle: return this.middle()
                case _.area.bottom: return this.bottom()
            }
        }

        this.getpoint = function (area) {
            return _.make.point(this._xarea(), this._yarea())
        }

        this.calculaterelativefit = function (relativerect, relativealign, selfalign, containerrect) {
            var result = _.make.rect(
                relativerect.xarea(relativealign) + (this._x - this._xarea(selfalign))
                , relativerect.yarea(relativealign) + (this._y - this._yarea(selfalign))
                , this._width
                , this._height
            )

            if (containerrect && (containerrect.inviewscore(result) != 4)) {
                return false
            } else {
                return true
            }
        }

        this.calculaterelative = function (relativerect, relativealign, selfalign, containerrect) {
            var result = _.make.rect(
                relativerect.xarea(relativealign)  - this._xarea(selfalign)
                , relativerect.yarea(relativealign) - this._yarea(selfalign)
                , this._width
                , this._height
            )

            if (containerrect) {
                if (!_.inbetween(result.x, containerrect.x, containerrect.right())) {
                    result.x = containerrect.x
                } else if (!_.inbetween(result.right(), containerrect.x, containerrect.right())) {
                    result.right(containerrect.right())
                    if (result.x < containerrect.x) { result.x = containerrect.x }
                }

                if (!_.inbetween(result.y, containerrect.y, containerrect.bottom())) {
                    result.y = containerrect.y
                } else if (!_.inbetween(result.bottom(), containerrect.y, containerrect.bottom())) {
                    result.bottom(containerrect.bottom())
                    if (result.y < containerrect.y) { result.y = containerrect.y }
                }
            }

            return result
        }
    })
})