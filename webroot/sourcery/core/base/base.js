//*************************************************************************************************
// base - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("base", function (_) {
    // Reserved collections
    _.enum = {}
    _.helper = {}
    _.define = {}

    // Constants
    _.crlf = "\r\n"
    _.lf = "\n"
    _.cr = "\r"

    _._uniqueid = 1

    _.uniqueid = function () {
        return _._uniqueid++
    }

    // Typecasting
    _.undef = function (value, initial) {
        return value === undefined ? initial : value
    }

    _.isstring = function (value) {
        return !!(value && value.constructor == String)
    }

    _.isnumber = function (value) {
        return !!((value != null) && value.constructor == Number)
    }

    _.isdate = function (value) {
        return !!(value && value.constructor == Date)
    }

    _.isarray = function (value) {
        return !!(value && value.constructor == Array)
    }

    _.isfunction = function (value) {
        return !!(value && value.constructor == Function)
    }

    _.isjson = function (value) {
        return !!(value && value.constructor == Object)
    }

    _.ispromise = function(obj) {
        return obj instanceof Promise
    }

    _.ismodel = function (value) {
        return !!(value && value._modelname)
    }

    _.isarraybuffer = function (value) {
        return !!(value && value.constructor == ArrayBuffer)
    }

    _.isregex = function (value) {
        return !!(value && value.constructor == RegExp)
    }

    _.iselement = function (value) {
        return !!(value && value.nodeType == 1)
    }

    _.isempty = function (value) {
        return value == "" || value == null
    }

    _.isemptyobject = function (obj) {
        if (obj == null) return true

        if (obj.length > 0) return false
        if (obj.length === 0) return true

        for (var prop in obj) {
            if (typeof obj.prop != "function") {
                return false
            }
        }
        return true
    }

    _.isodd = function (value) {
        return !!(value % 2)
    }

    _.iseven = function (value) {
        return !(value % 2)
    }

    _.iserror = function (value) {
        return !!(value && (value.constructor == Error || value instanceof _.kind.error))
    }

    _.isnumeric = function (value) {
        return !_.isarray(value) && value - parseFloat(value) + 1 == 1
    }

    _.normalize = function (value, context) {
        return _.isfunction(value) ? value.call(context) : value
    }

    _.cint = function (value) {
        return Math.round(value || 0)
    }

    _.cstr = function (str) {
        return str == null ? "" : str.toString()
    }

    _.tostring = function (value) {
        if (!value) {
            return ""
        } else if (_.isjson(value) || _.isarray(value)) {
            return JSON.stringify(value)
        } else {
            return value.toString()
        }
    }

    _.length = function (value) {
        if (!value) {
            return 0
        } else if (_.isstring(value)) {
            return value.length
        } else if (_.isarray(value)) {
            return value.length
        } else if (_.isjson(value)) {
            return Object.keys(value).length
        } else {
            return 1
        }
    }

    _.cbool = function (value) {
        var _truevalues = {
            y: true
            , yes: true
            , t: true
            , true: true
            , ja: true
            , j: true
        }

        if (typeof value == "string") {
            return _truevalues[value.toLowerCase()] || false
        }
        return !!value
    }

    _.arg2array = function (args) {
        return Array.prototype.slice.call(args)
    }

    // Loops and optimization
    _.done = new Error("done")
    _.done.cancel = true
    _.remove = new Error("remove")

    _.foreach = function (items, fn, context) {
        context = context || this

        if (_.isarray(items)) {
            for (var index = 0; index < items.length; index++) {
                if (fn.call(context, items[index], index) == _.done) return false
            }
        } else if (_.isjson(items)) {
            for (var index in items) {
                if (fn.call(context, items[index], index) == _.done) return false
            }
        } else if (items) {
            fn.call(context, items)
        }
    }

    _.rofeach = function (items, fn, context) {
        context = context || this

        if (_.isarray(items)) {
            index = items.length
            while (index--) {
                if (fn.call(context, items[index], index, items) == _.done) return false
            }
        } else if (_.isjson(items)) {
            var keys = Object.keys(items)
            index = 0 | keys.length

            while (index--) {
                var key = keys[index]
                if (fn.call(context, items[key], key, items) == _.done) return false
            }
        } else if (items) {
            fn.call(context, items)
        }
    };

    _.rofeach = function (items, fn, context) {
        context = context || this;

        if (_.isarray(items)) {
            index = items.length;
            while (index--) {
                if (fn.call(context, items[index], index, items) == _.done) return false;
            }
        } else if (_.isjson(items)) {
            var keys = Object.keys(items);
            index = 0 | keys.length;

            while (index--) {
                var key = keys[index];
                if (fn.call(context, items[key], key, items) == _.done) return false;
            }
        } else if (items) {
            fn.call(context, items);
        }
    };

    _.memoize = function (fn) {
        var cache = {};

        return function (value) {
            return cache[value] !== undefined ? cache[value] : (cache[value] = fn(value));
        };
    };

    _.define.enum = function (name, items, offset) {
        var values = {};
        var names = {};
        offset = offset || 0;

        _.foreach(items, function (itemname, index) {
            values[itemname] = index + offset;
            names[index + offset] = itemname;
        });

        _.enum[name] = values;
        _.enum[name + "name"] = names;

        return names;
    };

    _.define.binnum = function (name, items, offset) {
        var values = {};
        var names = {};
        var value = offset || 0;

        _.foreach(items, function (itemname) {
            values[itemname] = value;
            names[value] = itemname;

            value = (value ? value << 1 : 1);
        });

        _.enum[name] = values;
        _.enum[name + "name"] = names;

        return names;
    };

    // Vartypes
    _.noop = function () {};
    _.noop._functiontype = "noop";

    // Don't change the order
    _.vtnull = 0;
    _.vtstring = 1;
    _.vtboolean = 2;
    _.vtnumber = 3;
    _.vtdate = 4;
    _.vtregex = 5;
    _.vtfunction = 6;
    _.vtarray = 7;
    _.vtjson = 8;
    _.vtblob = 9;
    _.vtmodel = 10;

    _.define.enum("vartype", [
        "null"
        , "string"
        , "number"
        , "bool"
        , "date"
        , "regex"
        , "function"
        , "array"
        , "json"
        , "model"
    ]);

    _.vartype = function (value) {
        if (value == null) {
            return _.vtnull
        }

        switch (value.constructor) {
            case String: return _.vtstring
            case Number: return _.vtnumber
            case Boolean: return _.vtboolean
            case Date: return _.vtdate
            case RegExp: return _.vtregex
            case Function: return _.vtfunction
            case Array: return _.vtarray
            case Object: return _.vtjson

            default:
                if (value._modelname) {
                    return _.vtmodel
                }
        }
        return undefined
    }

    _.typename = function (value) {
        return _.enum.vartypename[_.vartype(value)]
    }

    _.var = {}

    _.var.createempty = function (vartype) {
        switch (vartype) {
            case _.vtnull: return null
            case _.vtstring: return ""
            case _.vtboolean: return false
            case _.vtnumber: return 0
            case _.vtdate: return _.now()
            case _.vtregex: return null
            case _.vtfunction: return _.noop
            case _.vtjson: return {}
            case _.vtarray: return []
        }
    }

    _.var.deepcompare = function (value1, value2) {
        // Handle null/undefined cases
        if (value1 === value2) return true
        if (!value1 || !value2) return false

        var type1 = _.vartype(value1)
        var type2 = _.vartype(value2)

        // Different types
        if (type1 !== type2) return false

        // Handle arrays
        if (_.isarray(value1)) {
            if (value1.length !== value2.length) return false

            for (var i = 0; i < value1.length; i++) {
                if (!_.var.deepcompare(value1[i], value2[i])) return false
            }
            return true
        }

        // Handle objects
        if (_.isjson(value1)) {
            var keys1 = Object.keys(value1)
            var keys2 = Object.keys(value2)

            if (keys1.length !== keys2.length) return false

            for (var key of keys1) {
                if (!value2.hasOwnProperty(key)) return false
                if (!_.var.deepcompare(value1[key], value2[key])) return false
            }
            return true
        }

        // Handle dates
        if (_.isdate(value1)) {
            return value1.getTime() === value2.getTime()
        }

        // Handle primitive values
        return value1 === value2
    }
})
.ontest("isjson", function (_) {
    this.assert(_.isjson([1, 2, 3]), false, "isjson test array")
    this.assert(_.isjson({ a: 1 }), true, "isjson test json")
    this.assert(_.isjson(new function () {}), false, "isjson test class")
});

