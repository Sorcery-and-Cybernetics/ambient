//*************************************************************************************************
// basicarray - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicarray", function (_) {
    _.slicearray = Array.prototype.slice

    //Polyfill
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    };

    _.last = function (array) {
        return array && array.length ? array[array.length - 1] : null
    }

    _.first = function (obj) {
        switch (_.vartype(obj)) {
            case _.vtnull:
                return null
            case _.vtarray:
                return obj.length ? obj[0] : null
            case _.vtjson:
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return obj[key]
                    }
                }
                return null
            default:
                return obj
        }
    }

    _.inarray = function (ar, search, ignorecase, key, last) {
        var index
        var item

        if (ignorecase) { search = _.lcase$(search) }

        if (last) {
            for (var index = ar.length - 1; index >= 0; index--) {
                if (key) {
                    item = ar[index][key]
                } else {
                    item = ar[index]
                }
                if (_.isfunction(item)) {
                    item = item.call(ar[index])
                }
                if (ignorecase) {
                    item = _.lcase$(item)
                }
                if (item === search) {
                    return index
                }
            }
        } else {
            for (var index = 0; index < ar.length; index++) {
                if (key) {
                    item = ar[index][key]
                } else {
                    item = ar[index]
                }
                if (_.isfunction(item)) {
                    item = item.call(ar[index])
                }
                if (ignorecase) {
                    item = _.lcase$(item)
                }
                if (item === search) {
                    return index
                }
            }
        }

        return -1
    }

    _.findinarray = function (ar, search, ignorecase, key, last) {
        var index = _.inarray(ar, search, ignorecase, key, last)
        return index >= 0 ? ar[index] : null
    }

    _.searcharray = function (ar, search, ignorecase, key) {
        var result = []

        var index
        var item

        if (ignorecase) { search = _.lcase$(search) }

    
        for (var index = 0; index < ar.length; index++) {
            if (key) {
                item = ar[index][key]
            } else {
                item = ar[index]
            }
            
            if(_.isfunction(item)){
                item = item.call(ar[index])
            }
            if (ignorecase) {
                item = _.lcase$(item)
            }
            if (item == search) {
                result.push(ar[index])
            }
        }
        
        return result
    }

    _.insortedarray = function (items, search, keyname, casesensitive, findlast, matchlength, fncompare) {
        var low = 0
        var high = items.length
        var mid = 0
        var found = -1
        var item

        if (casesensitive) { search = search.toLowerCase() }
        fncompare = fncompare || _.compare$

        while (low < high) {
            mid = low + ((high - low) >>> 1)

            item = keyname ? items[mid][keyname] : items[mid]
            if (!casesensitive) { item = ("" + (item || "")).toLowerCase() }
            if (matchlength) { item = ("" + (item || "")).substring(0, matchlength) }

            switch (fncompare(search, item)) {
                case 0:
                    found = mid
                    if (findlast) {
                        low = mid + 1
                    } else {
                        high = mid
                    }
                    break
                case -1:
                    high = mid
                    break
                case 1:
                    low = mid + 1
                    break
            }
        }
        return found < 0 ? -low - 1 : found
    }

    _.array = {}

    _.array.length = function (ar) {
        if (_.isarray(ar)) {
            return ar.length
        }
        return 0
    }

    _.array.insert = function (items, index, item, ordered) {
        index = index || items.length + 1

        if (_.isarray(item)) {
            items.splice.apply(items, [index, 0].concat(item))
        } else {
            items.splice(index - 1, 0, item)
            if (ordered) {
                _.array.reindex(items, index)
            }
            return items
        }
    }

    _.array.remove = function (items, index, ordered) {
        index = index || items.length
        if (!index) { return }

        var item = items.splice(index - 1, 1)

        //            if (item && item[0].orderindex !== undefined) {
        if (ordered) {
            _.array.reindex(items, index)
        }
    }

    _.array.intersect = function (array1, array2) {
        if (array1 == null || array2 == null) {
            return null
        }
        if (array1.length == 0 || array2.length == 0) {
            return []
        }
        return array1.filter(function (item) {
            return array2.indexOf(item) !== -1
        })
    }

    _.array.reindex = function (items, index) {
        if (!items) { return }

        for (; index <= items.length; index++) {
            items[index - 1].orderindex = index
        }
    }

    _.array.changeindex = function (items, index, newindex) {
        newindex = newindex || items.length + 1
        var lowest = Math.min(index, newindex)

        var item = items.splice(index - 1, 1)
        items.splice(newindex - 1, 0, item[0])

        this.reindex(items, lowest)
    }

    _.array.tojson = function (ar, key) {
        var result = {}

        _.foreach(ar, function (item) {
            result[item[key]] = item
        })
        return result
    }

    _.array.todict = function (ar) {
        var result = {}

        _.foreach(ar, function (item, index) {
            result[item] = index + 1
        })
        return result
    }

    _.array.pluck = function (list, key) {
        var result = []

        _.foreach(list, function (item) {
            if (item) {
                item = item[key]
                if (item != null) {
                    result.push(item)
                }
            }
        })
        return result
    }

    _.array.fill = function (ar, posstart, posend, valuestart, valueend, formula) {
        var length = ar.length

        posstart = posstart || 0
        posend = posend == null ? length - 1 : posend

        if (valueend == null) { valueend = valuestart }

        var count = posend - posstart + 1

        if (count) {
            var diff = (valueend - valuestart) / (count - 1)
            var value = valuestart

            for (var index = posstart; index < posend; index++) {
                ar[index] = formula? formula(value): value
                value += diff
            }

            ar[posend] = formula ? formula(valueend) : valueend
        }
        return ar
    }

    _.array.startswith = function (ar1, ar2) {
        var len = ar1.length
        var result = true
        var i = 0

        while (result && i < len) { 
            result = ar1[i] == ar2[i]
            i++
        }
        return result
    }

    _.array.sort = function (ar, keyfn) {
        if (!ar) {
            return
        }
        if (!keyfn) {
            keyfn = function (a) { return a }
        }
        ar.sort(function (a, b) {
            var keya = keyfn(a)
            var keyb = keyfn(b)

            if (keya == keyb) { return 0; }
            if (keya > keyb) {
                return 1;
            }
            else {
                return -1;
            }
        })
    }

    _.array.swap = function (ar, posa, posb) {
        var mem = ar[posa]
        ar[posa] = ar[posb]
        ar[posb] = mem

        return ar
    }

    _.array.shuffle = function (ar, lbound, ubound) {
        lbound = lbound || 0
        ubound = Math.min(ar.length - lbound - 1, (ubound || ar.length))

        var result = ar.slice()

        for (var index = lbound; index <= ubound; index++) {
            var swappos = _.math.random(lbound, ubound)
            _.array.swap(result, index, swappos)
            
        }

        return result
    }
})