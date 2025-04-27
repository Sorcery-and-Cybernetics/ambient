//*************************************************************************************************
// basicstring - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicstring", function (_) {
    _.asc = function (str) {
        return _.cstr(str).charCodeAt(0)
    }

    _.chr$ = function (value) {
        return String.fromCharCode(value || 0)
    }

    _.isalpha$ = function (str) {
        var chr = ""
        
        if (!_.isstring(str)) { return false }

        for (var pos = 0; pos < str.length; pos++) {
            chr = str.charCodeAt(pos)

            if ((chr < 65) || (chr > 122)) { return false }
            if ((chr > 90) && (chr < 97)) { return false }
        }
        return true
    }
    
    _.isalphanumeric$ = function (str) {
        var chr = ""

        if (!_.isstring(str)) { return false }

        for (var pos = 0; pos < str.length; pos++) {
            chr = str.charCodeAt(pos)

            if (chr < 65) {
                if ((chr < 48) || (chr > 57)) { return false }
            } else if (chr > 122) {
                return false
            } else {
                if ((chr > 90) && (chr < 97)) { return false }
            }
        }
        return true
    }


    _.trim$ = function (str) {
        return _.cstr(str).replace(/^\s+/, "").replace(/\s+$/, "")
    }

    _.ltrim$ = function (str) {
        return _.cstr(str).replace(/^\s+/, "")
    }

    _.rtrim$ = function (str) {
        return _.cstr(str).replace(/\s+$/, "")
    }

    _.split$ = function (str, delimiter) {
        return _.cstr(str).split(delimiter)
    }

    _.splittrim$ = function (str, delimiter) {
        if (!_.isregex(delimiter)) {
            delimiter = new RegExp("\\s*" + delimiter + "\\s*")
        }
        return _.split$(str, delimiter)
    }

    _.join$ = function (list, delimiter) {
        return _.isarray(list) ? list.join(delimiter) : list
    }

    _.string$ = function (count, fillchar) {
        return new Array(count + 1).join(fillchar)
    }

    _.padleft$ = function (str, fillchar, count) {
        str = _.cstr(str)

        var lenstr = str.length

        if (lenstr >= count) return str
        return _.string$(count - lenstr, fillchar) + str
    }

    _.padright$ = function (str, fillchar, count) {
        str = _.cstr(str)

        var lenstr = str.length

        if (lenstr >= count) return str
        return str + _.string$(count - lenstr, fillchar)
    }

    _.instr$ = function (str, search, pos) {
        return _.lcase$(str).indexOf(_.lcase$(search), pos - 1) + 1
    }

    _.instrrev$ = function (str, search, pos) {
        if (pos) {
            return _.lcase$(str).lastIndexOf(_.lcase$(search), pos - 1) + 1;
        } else {
            return _.lcase$(str).lastIndexOf(_.lcase$(search)) + 1;
        }
    }

    _.compare$ = function (value1, value2) {
        return value1 > value2 ? 1 : value1 < value2 ? -1 : 0
    }

    _.comparelike$ = function (value1, value2) {
        return _.compare$(value1, _.left$(value2, value1.length))
    }

    _.match$ = function (str, search) {
        if (!str) { return false }
        if (!search) {
            return true
        } else if (!_.isregex(search)) {
            if (search == "*") { return true }
            search = RegExp("^" + search.replace(/\*/g, ".*") + "$", "i")
        }
        return search.test(str)
    }

    _.left$ = function (str, pos) {
        if (!_.isarray(str)) {
            str = _.cstr(str)
        }
        return str.slice(0, pos)
    }

    _.right$ = function (str, pos) {
        if (!_.isarray(str)) {
            str = _.cstr(str)
        }
        return str.substr(str.length - pos)
    }

    _.mid$ = function (str, pos, length) {
        if (!_.isarray(str)) {
            str = _.cstr(str)
        }

        if (length > 0) {
            if (pos < 0) { pos += str.length }
            length += (pos - 1)
        }
        return str.slice(pos - 1, length)
    }

    _.sub$ = function (str, posb, pose) {
        if (!_.isarray(str)) {
            str = _.cstr(str)
        }

        return str.slice(posb - 1, pose)
    }
    _.replace$ = function (str, search, replace) {
        return _.cstr(str).split(search).join(replace || "")
    }

    _.lcase$ = function (str) {
        return _.cstr(str).toLowerCase()
    }

    _.ucase$ = function (str) {
        return _.cstr(str).toUpperCase()
    }

    _.capitalize$ = function (word) {
        if (!word) { return "" }
        return _.left$(word, 1).toUpperCase() + _.mid$(word, 2)
    }

    _.findcutmarks$ = function (str, left, right, outerselect, cleancut) {
        var leftlen = left ? left.length : 0
        var rightlen = right ? right.length : 0
        var strlen = str ? str.length : 0

        var validcut = true

        var posb = 0
        var pose = strlen - 1

        if (leftlen) {
            posb = str.indexOf(left)

            if (posb < 0) {
                validcut = false
            }
        }

        if (rightlen) {
            if (outerselect) {
                pose = str.lastIndexOf(right)
            } else {
                pose = str.indexOf(right, posb + 1)
            }

            if (pose < 0) {
                validcut = false
            }
        }

        if (validcut) {
            if (cleancut) {
                posb += leftlen
            } else {
                pose += rightlen
            }
        }

        return {
            validcut: validcut

            , posb: posb
            , pose: pose

            , leftlen: leftlen
            , rightlen: rightlen

            , strlen: strlen
        }
    }

    //Returns greedy cut out from str excluding left + right
    _.innercut$ = function (str, left, right) {
        var cutmarks = _.findcutmarks$(str, left, right, false, true)

        return (cutmarks.validcut ? str.substring(cutmarks.posb, cutmarks.pose) : "")
    }

    //Returns greedy cut out from str including left + right
    _.innerfullcut$ = function (str, left, right) {
        var cutmarks = _.findcutmarks$(str, left, right, false, false)

        return (cutmarks.validcut ? str.substring(cutmarks.posb, cutmarks.pose) : "")
    }

    //Returns lazy cut out from str excluding left + right
    _.outercut$ = function (str, left, right) {
        var cutmarks = _.findcutmarks$(str, left, right, true, true)

        return (cutmarks.validcut ? str.substring(cutmarks.posb, cutmarks.pose) : "")
    }

    //Returns lazy cut out from str including left + right
    _.outerfullcut$ = function (str, left, right) {
        var cutmarks = _.findcutmarks$(str, left, right, true, false)

        return (cutmarks.validcut ? str.substring(cutmarks.posb, cutmarks.pose) : "")
    }

    //Returns str with paste inserted into str between left + right. Will paste left off selection.
    _.insertleft$ = function (str, left, right, paste) {
        var cutmarks = _.findcutmarks$(str, left, right, false, true)

        return (cutmarks.validcut ? str.substring(0, cutmarks.posb) + paste + str.substring(cutmarks.posb) : "")
    }

    //Returns str with paste inserted into str between left + right. Will paste right off selection.
    _.insertright$ = function (str, left, right, paste) {
        var cutmarks = _.findcutmarks$(str, left, right, false, true)

        return (cutmarks.validcut ? str.substring(0, cutmarks.pose) + paste + str.substring(cutmarks.pose) : "")
    }

    //Returns str with paste inserted into str. Replaces selection excluding left and right.
    _.replace$ = function (str, left, right, paste) {
        if (!paste) { return str }
        var cutmarks = _.findcutmarks$(str, left, right, false, true)

        return (cutmarks.validcut ? str.substring(0, cutmarks.posb) + paste + str.substring(cutmarks.pose) : "")
    }

    //Returns str with paste inserted into str. Replaces selection including left and right.
    _.replacefull$ = function (str, left, right, paste) {
        if (!paste) { return str }
        var cutmarks = _.findcutmarks$(str, left, right, false, false)        

        return (cutmarks.validcut ? str.substring(0, cutmarks.posb) + paste + str.substring(cutmarks.pose) : "")
    }


    //kvsplit$ replaces
    //_.key$ = function (line, delimiter, reverse, keyisleading, keepdelimiter) { }
    //_.value$ = function (line, delimiter, reverse, keyisleading, keepdelimiter) { }

     //
    _.kvsplit$ = function (line, delimiter, reverse, initial) {
        line = _.trim$(line)

        initial = initial === undefined ? "" : initial

        delimiter = delimiter || "="

        if (reverse) {
            var pos = line.lastIndexOf(delimiter)
        } else {
            var pos = line.indexOf(delimiter)
        }

        return {
            key: _.trim$(pos >= 0 ? line.substring(0, pos) : line)
            , value: pos >= 0 ? _.trim$(line.substring(pos + delimiter.length)) : initial
            , delimiter: delimiter
            , line: line
            , pos: pos
        }
    }

    _.leftof$ = function (line, delimiter) {
        return _.kvsplit$(line, delimiter).key
    }

    _.rightof$ = function (line, delimiter) {
        return _.kvsplit$(line, delimiter).value
    }

    _.leftoflast$ = function (line, delimiter) {
        return _.kvsplit$(line, delimiter, true).key
    }

    _.rightoflast$ = function (line, delimiter) {
        return _.kvsplit$(line, delimiter, true).value
    }

    //Replace $pattern$ in text with params[pattern]
    //Example (json):  format$("replace {1st} for {2nd}", {"1st": "this", "2nd": "that" })  => returns "replace this for that"
    //Example (array): format$("replace {0} for {1}", ["this","that"] )                     => returns "replace this for that"
    _.format$ = function (text, params) {
        return _.cstr(text).replace(/\{([\w.]*)\}/gi, function (m, pattern) {
            var param = _.json.get(params, pattern)
            return _.cstr(_.normalize(param, params))
        })
    }

    //Find values within a text on the hand of a mask. 
    //Example:  unformat$("replace this for that", "replace {1st} for {2nd}") => return {"1st": "this", "2nd": "that" }
    _.unformat$ = function (str, mask) {
        var paramnames = []
        var paramvalues = []

        mask = mask.replace(/\{.*?\}/gi, function (param) {
            param = _.trim$(_.mid$(param, 2, -1))
            if (param == "*") { param = "" }
            paramnames.push(param || paramnames.length)
            return "\(\.\*\)"
        })

        var regmask = new RegExp(mask, "i")

        str.replace(regmask, function () {
            paramvalues = _.slicearray.call(arguments, 1)
        })

        var params = {}
        for (var index = 0; index < paramnames.length; index++) {
            params[paramnames[index]] = paramvalues[index] || null
        }
        return params
    }

    _.paste$ = function (left, middle, right) {
        if (middle) {
            return _.cstr(left) + _.cstr(middle) + _.cstr(right)
        }
        return ""
    }

    _.combine$ = function (left, middle, right) {
        if (left && right) {
            return _.cstr(left) + _.cstr(middle) + _.cstr(right)
        } else {
            return _.cstr(left) || _.cstr(right)
        }
    }

    //Splitting query string
    _.splitcommandline$ = function (line, delim, kvdelim) {
        if (!line) { return {} }

        delim = delim || "&"
        kvdelim = kvdelim || "="

        var result = {}

        _.foreach(_.split$(line, delim), function (command) {
            if (command) {
                var kv = _.kvsplit$(command, kvdelim)

                result[kv.key.toLowerCase()] = decodeURIComponent(kv.value.replace(/\+/g, '%20'))
            }
        })
        return result
    }

    _.startswith$ = function (str, value) {
        var len = value.length
        return _.lcase$(_.left$(str, len)) == _.lcase$(value)
    }
    
    _.endswith$ = function (str, value) {
        var len = value.length
        return _.lcase$(_.right$(str, len)) == _.lcase$(value)
    }
 
})

