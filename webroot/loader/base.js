//*************************************************************************************************
// base - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function(_){
    _.debug = function (line) {
        if ((typeof Debug !== "undefined") && Debug.writeln) {
            Debug.writeln(line)
        }

        if ((typeof console !== "undefined") && console.log) {
            console.log(line)
        }
    }

    _.noop = function () { }
    _.noop.__functiontype = "noop"
    
    _.isfunction = function (value) {
        return !!(value && (value.constructor === Function))
    }
    
    _.isjson = function (value) {
        return !!(value && (value.constructor === Object))
    }

    _.isstring = function(value) {
        return !!(value && (value.constructor == String))
    }

    _.isarray = function(value) {
        return !!(value && (value.constructor == Array))
    }

    _.cstr = function(str) {
        return str == null ? "" : str.toString()
    }
    
    _.normalize = function (value, context, arg) {
        return _.isfunction(value) ? value.call(context, arg) : value
    }
    
    _.sameleft$ = function (str1, str2) {
        var pos = 0
        var result = ""
        
        while ((pos < str1.length) && (pos < str2.length)) {
            if (str1.charCodeAt(pos) != str2.charCodeAt(pos)) {
                break
            }
            result += str1.charAt(pos)
            pos++
        }
        
        return result
    }

    _.trim$ = function (str) {
        return _.cstr(str).replace(/^\s+/, "").replace(/\s+$/, "")
    }  

    _.split$ = function (str, delimiter, count) {
        return str == null ? [] : str.toString().split(delimiter, count)
    }

    _.foreach = function (items, next) {
        if (_.isarray(items)) {
            for (var index = 0; index < items.length; index++) {
                next(items[index], index)
            }
        } else {
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    next(items[key], key)
                }
            }
        }
    }
    
    _.extend = function (target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                var value = source[key]
                
                if (_.isjson(value)) {
                    if (!target[key]) { target[key] = {} }
                    if (!_.isjson(target[key])) { throw "Error in _.extend: target[" + key + "] is not an object." }
                    _.extend(target[key], value)
                } else {
                    target[key] = value
                }
            }
        }
    }

    _.merge = function (target, source) {
        var result = {}

        _.extend(result, target)
        _.extend(result, source)
        
        return result
    }

}) (_.ambient)

