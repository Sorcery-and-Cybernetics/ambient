//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("unittest", function (_) {
})
.onload(function(_) {
    
    _.define.object("unittestline", function() {
        this._unittest = null
        this._grouptitle = ""
        this._assert = null
        this._expected = null
        this._message = ""
        this._method = ""
        this._failed = false 
        
        this.construct = function(unittest, grouptitle, assert) {
            this._unittest = unittest
            this._grouptitle = grouptitle
            this._assert = assert
        }

        this.is = function(expected, message) {
            return this.assert("is", expected, message)
        }

        this.isnot = function(expected, message) {
            return this.assert("isnot", expected, message)
        }

        this.has = function(expected, message) {
            return this.assert("has", expected, message)
        }

        this.hasnot = function(expected, message) {
            return this.assert("hasnot", expected, message)
        }

        this.assert = function(method, expected, message) {
            this._method = method
            this._expected = expected
            this._message = message

            if (_.ispromise(this._assert)) {
                this._assert.then(function(value) {
                    this._assert = value
                    this.evaluate()
                    this._unittest.onlinefinish(this)
                }.bind(this))
            } else {
                this.evaluate()
                this._unittest.onlinefinish(this)
            }

            return this
        }

        this.evaluate = function() {
            switch (this._method) {
                case "is":
                    if (((this._expected == null) && (this._assert != null)) || (!_.var.deepcompare(this._assert, this._expected))) {
                        this._failed = true
                    }
                    break

                case "isnot":
                    if (((this._expected == null) && (this._assert == null)) || (_.var.deepcompare(this._assert, this._expected))) {
                        this._failed = true
                    }
                    break

                case "has":
                    if (this._assert instanceof Array) {
                        if (!this._assert.includes(this._expected)) {
                            this._failed = true
                        }
                    } else if (typeof this._assert == "string") {
                        if (this._assert.indexOf(this._expected) == -1) {
                            this._failed = true
                        }
                    } else {
                        this._failed = true
                    }
                    break

                case "hasnot":
                    if (this._assert instanceof Array) {
                        if (this._assert.includes(this._expected)) {
                            this._failed = true
                        }
                    } else if (typeof this._assert == "string") {
                        if (this._assert.indexOf(this._expected) != -1) {
                            this._failed = true
                        }
                    } else {
                        this._failed = true
                    }
                    break

            }
        }

        this.debugout = function() {
            var result = (this._failed? "FAIL: " : "PASS: ")

            result += this._assert + " " + this._method + " " + this._expected + (this._message? " - " + this._message: "")
            return result
        }
    })

    _.define.object("unittest", function() {
        this._unittester = null
        this._modulename = null
        this._testname = null
        this._lines = null
        this._showall = false

        this._failcount = 0
        this._promisecount = 0

        this._currentgroup = ""
        this._source = null
        
        this.construct = function(unittester, modulename, testname, source) {
            this._unittester = unittester
            this._modulename = modulename
            this._testname = testname
            this._source = source
            this._lines = []
        }

        this.group = function(groupname) {
            this._currentgroup = groupname
        }

        this.failcount = function() { return this._failcount }
        this.totalcount = function() { return this._lines.length }
        this.testname = function() { return this._modulename + " - " + this._testname }
        this.source = function() { return this._source }
        this.showall = function(value) { 
            if (value === undefined) { return this._showall }
            this._showall = value 
            return this 
        }

        this.test = function(assert) {
            var line = _.model.unittestline(this, this._currentgroup || "", assert)
            if (_.ispromise(assert)) {   
                this._promisecount++
            }
            this._lines.push(line)
            return line
        }

        this.assert = function(assert, expected, message) {
            this.test(assert).is(expected, message)
        }

        this.onlinefinish = function(line) {
            if (line._failed) {
                this._failcount++
            }
            if (_.ispromise(line._assert) ) {
                this._promisecount--

                if (this._promisecount == 0) {
                    this.onfinish()
                }                
            }
        }

        this.onfinish = _.model.basicsignal()

        this.debugout = function(showall) {
            var result = []

            if (!showall && !this._showall && (this._failcount == 0)) { return }

            result.push("")
            result.push("Unit test: " + this._testname + " (" + this._modulename + ")")

            var currentgroup = ""

            for (var i = 0; i < this._lines.length; i++) {
                var line = this._lines[i]

                if (line._grouptitle !== currentgroup) {
                    currentgroup = line._grouptitle
                    if (currentgroup) { 
                        result.push("")
                        result.push("Group: " + currentgroup)
                    }
                }
                result.push(line.debugout())
            }

            return result.length? result: null
        }
    })

    _.define.object("unittester", function() {
        this._tests = null
        this._failcount = 0

        this.create = function() {
            var me = this
            me._unittests = []

            _.foreach(_._modules, function(module) {
                var modulename = module.fullpath()

                if (module._tests) { 
                    _.foreach(module._tests, function(test) {
                        var unittest = _.model.unittest(this, modulename, test.testname || "", test.source)
                        me._unittests.push(unittest)
                    })
                }
            })
            return this
        }

        this.start = function() {
            //if (!this._tests.length) { return this() }

            // _.foreach(this._tests, function(test) {
            //     test.source().call(test, _)
            // })

            // this.onfinish()

            var me = this
                    
            _.foreachasync(this._unittests, function(unittest, next) {
                unittest.source().call(unittest, _)
                if (unittest._promisecount == 0) { 
                    next() 
                } else {
                    unittest.onfinish(function() {
                        next()
                    })
                }
            }, function() {
                me.onfinish()
            })   

            return this         
        }

        this.onfinish = _.model.basicsignal()

        this.debugout = function(showall) {
            var result = []

            for (var i = 0; i < this._unittests.length; i++) {
                var unittest = this._unittests[i]
                var unittestresult = unittest.debugout(showall)

                if (unittestresult) { 
                    result = result.concat(unittestresult)
                }
            }    

            return result
        }
    })


    var unittester = _.model.unittester(this)
        .create()
        .onfinish(function() {
            var result = unittester.debugout(false)

            _.foreach(result, function(line) {
                _.debug(line)
            })
        })

        unittester.start()
    // var result = unittester.debugout(true)

    // _.foreach(result, function(line) {
    //     _.debug(line)
    // })
})
