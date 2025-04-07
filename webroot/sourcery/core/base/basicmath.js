//*************************************************************************************************
// basicmath - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicmath", function (_) {
    var rnd = null

    //Algorithm based on lcg 
    var m_w = 123456789;
    var m_z = 987654321;
    var mask = 0xffffffff;

    // _.seed = function (seed) {
    //     if (seed == null) { seed = Date.now() }

    //     m_w = (123456789 + seed) & mask;
    //     m_z = (987654321 - seed) & mask;
    // }

    // _.seed()

    // var random = function () {
    //     m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    //     m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        
    //     return ((m_z << 16) + (m_w & 65535)) >>> 0;
    // }

    // var random = function (lbound, ubound) {
    //     if (ubound == undefined) {
    //         ubound = lbound
    //         lbound = 1
    //     }

    //     return (random() % (ubound - lbound + 1)) + lbound
    // }    

    _.math = {
        random: function (lbound, ubound) {
            if (ubound == undefined) {
                ubound = lbound
                lbound = 1
            }
            return Math.floor(Math.random() * (ubound - lbound + 1)) + lbound
        }

        , round: function (value, decimals) {
            //Thanks to http://www.jacklmoore.com/notes/rounding-in-javascript/
            return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
        }

        , roundto: function (value, divider) {
            return Math.round(value / divider) * divider
        }

        , floorto: function (value, divider) {
            return Math.floor(value / divider) * divider
        }

        , ceilto: function (value, divider) {
            return Math.ceil(value / divider) * divider
        }

        , anchorto: function (value, divider, margin) {
            var anchor = Math.round(value / divider) * divider
            return Math.abs(anchor - value) <= margin ? anchor : value
        }

        , hex2: function (dec) {
            var hex = "0123456789ABCDEF"
            return hex.charAt((dec >> 4) & 15) + hex.charAt(dec & 15)
        }

        , perc: function (current, max) {
            return max == 0 ? 1 : Math.round(current / max * 100)
        }


        , percfrom: function (current, min, max) {
            min = min || 0
            if ((max - min) == 0) { return 0 }
            return ((current - min) / (max - min))
        }

        , percto: function (min, max, perc) {
            return ((max - min) * (perc / 100)) + min
        }

        , perctoperc: function (min, max, perc) {
            //If max = 0 then result = Infinity
            var value = ((max - min) * (perc / 100)) + min
            value = (value / max)
            return value
        }

        , between: function (value, floor, ceil) {
            return (value >= floor) && (value < ceil) ? true : false
        }

        , inbetween: function (value, floor, ceil) {
            return (value >= floor) && (value <= ceil) ? true : false
        }

        , exbetween: function (value, floor, ceil) {
            return (value > floor) && (value < ceil) ? true : false
        }

        , limitbetween: function (value, floor, ceil) {
            return (value < floor ? floor : (value > ceil ? ceil : value))
        }

        , limitmin: function (value, floor, ceil) {
            if (value == null) { value = floor }
            return (value < floor ? floor : (value > ceil ? ceil : value))
        }

        , limitmax: function (value, floor, ceil) {
            if (value == null) { value = ceil }
            return (value < floor ? floor : (value > ceil ? ceil : value))
        }


        , loopbetween: function (value, floor, ceil) {
            if (value < floor) {
                value = ceil
            } else if (value > ceil) {
                value = floor
            }
            return value
        }

        , snapdiff: function (value, margin, floor, ceil) {
            if (value <= floor + margin) {
                return floor - value
            } else if (value >= ceil - margin) {
                return ceil - value
            }
            return 0
        }

        , snapto: function (value, margin, floor, ceil) {
            return value + _.math.snapdiff(value, margin, floor, ceil)
        }

        , log: function (base, value) {
            return Math.log(value) / Math.log(base || 10)
        }

        , logarithmicchance: function (levelsize, maxlevel) {
            var maxsize = Math.pow(levelsize, maxlevel) - 1
            var random = _.math.random(1, maxsize)
            return maxlevel - _.math.floor(_.math.log(levelsize, random))
        }

        , max: Math.max
        , min: Math.min

        , radtodeg: function (radians) {
            return radians * (180 / Math.PI)
        }

        , degtorad: function (degrees) {
            return degrees / (180 / Math.PI)
        }

        , sumsq: function (x, y) {
            return Math.sqrt(x * x + y * y)
        }

        , atan: function (x, y) {
            return Math.atan2(y, x)
        }

        , dist: function (c1, c2) {
            return Math.sqrt(Math.pow(c1.x - c2.x,2) + Math.pow(c1.y - c2.y,2))
        }

        , floor: Math.floor
        , ceil: Math.ceil
        , abs: Math.abs
        , sin: Math.sin
        , cos: Math.cos
        , tan: Math.tan
        , asin: Math.asin
        , acos: Math.acos
        , atan2: Math.atan2
        , sqrt: Math.sqrt
        , pow: Math.pow
        , exp: Math.exp
    }

})
.onload(function(_) {
    // _.debug("Log chance")

    // var maxlevel = 4
    // var levelsize = 4
    // var count = 10000000

    // var result = []
    // for (var index = 0; index <= maxlevel + 4; index++) {
    //     result[index] = 0
    // }

    // for (var i = 0; i < count; i++) {
    //     var chance = _.math.logarithmicchance(levelsize, maxlevel)
    //     result[chance]++
    // }

    // console.log("Level\tCount")
    // var total = 0

    // for (var index = 0; index <= result.length; index++) {
    //     if (result[index]) {
    //         total += result[index]
    //     }
    // }

    // for (var index = 0; index <= result.length; index++) {
    //     var levelvalue = result[index]

    //     if (levelvalue) {
    //         console.log(index + "\t" + levelvalue  + "\t" + _.math.perc(levelvalue, total))
    //     }
    // }
})
