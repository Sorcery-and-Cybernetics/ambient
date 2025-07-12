//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("basicdebug", function (_) {
    _.debug = function (text) {
        return _.debug.write("debug", arguments)
    }

    _.debug.write = function (mode, text) {
        var line = _.formatdate$ ? _.formatdate$(_.now(), "yyyy-mm-dd hh:nn:ss:iii") + " - " : ""

        if (_.isstring(text)) {
            text = [text]
        }

        for (var index = 0; index < text.length; index++) {
            var arg = text[index]
            if (arg && (typeof arg.value == "function")) { arg = arg.value() }
            line += (index ? (index == 1? ": ": ", ") : "") + (typeof arg == "object" ? JSON.stringify(arg, null, (text.length == 1 ? 4 : null)) : arg)
        }

        if ((typeof Debug !== "undefined") && Debug.writeln) {
            Debug.writeln(line)
        }

        if (mode != "silent") {
            //_.console.log(line, mode)
            console.log(line)
        }
        return line
    }

    _.debug.assertstart = function(title) {
        
        _.debug.assertlog = { 
            title: title
            , failed: false
            , asserts: []
        }
    }

    _.debug.assertfinish = function() {
        var assertlog = _.debug.assertlog

        if (assertlog && assertlog.failed) {
            _.debug.write("assert", ["Failing assert", assertlog.title])
            _.foreach(assertlog.asserts, function(assert) {
                _.debug.write("assert", assert)
            })
        }
        _.debug.assertlog = null
    }    

    _.debug.assert = function (result, expected, message) {
        result = _.normalize(result)

        if (_.var.deepcompare(result, expected))  {
            if (_.debug.assertlog && message) {
                _.debug.assertlog.asserts.push(_.debug.write("silent", ["Pass assert", message]))
            }

        } else {
            if (_.debug.assertlog) {
                _.debug.assertlog.failed = true
                _.debug.assertlog.asserts.push(_.debug.write("silent", ["Fail assert", message || result]))
            } else {
                _.debug.write(null, ["assert fail", message || result])
            }
        }
    }
})