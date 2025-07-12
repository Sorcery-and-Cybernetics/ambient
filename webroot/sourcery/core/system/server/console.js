//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("console", function (_) {
    _.define.globalobject("console", function() {
        this.construct = function() {
            var me = this

            process.stdin.setEncoding('utf8')

            process.stdin.on('data', function(data) {
                me.oninput(data.trim())
            })        
        }

        this.log = function (line, mode) {
            if ((console == null) || !console.log) { return }

            if (mode && _.isserver) {
                console.log(_.debug.consolecolors[mode.toLowerCase()] + line + _.debug.consolecolors["eol"])
            } else {
                console.log(line)
            }
        }

        this.write = function (text, mode) {
            if (!process || !process.stdout || !process.stdout.write) { return }

            if (mode && _.isserver) {
                process.stdout.write(_.debug.consolecolors[mode.toLowerCase()] + text + _.debug.consolecolors["eol"])
            } else {
                process.stdout.write(text)
            }
        }

        this.clear = function() {
            if ((console == null) || !console.log) { return }
            console.clear()
        }

        this.oninput = _.model.signal()
    })
})