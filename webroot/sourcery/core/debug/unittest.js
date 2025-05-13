//*************************************************************************************************
// testtest - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("unittest", function (_) {
    //We cannot add code here, we are at the start of the load order.
    var x = 10
})
.onload(function(_) {
    
    _.define.core.object("core.unittestline", function() {
        this.__unittest = undefined;
        this.__grouptitle = "";
        this.__assert = undefined;
        this.__expected = undefined;
        this.__message = "";
        this.__method = "";
        this.__failed = false; 
        
        this.construct = function(unittest, grouptitle, assert) {
            this.__unittest = unittest;
            this.__grouptitle = grouptitle;
            this.__assert = assert;
        }

        this.is = function(expected, message) {
            return this.assert("is", expected, message);
        }

        this.isnot = function(expected, message) {
            return this.assert("isnot", expected, message);
        }

        this.has = function(expected, message) {
            return this.assert("has", expected, message);
        }

        this.hasnot = function(expected, message) {
            return this.assert("hasnot", expected, message);
        }

        this.assert = function(method, expected, message) {
            this.__method = method;
            this.__expected = expected;
            this.__message = message;

            if (_.ispromise(this.__assert)) {
                this.__assert.then(function(value) {
                    this.__assert = value;
                    this.evaluate();
                    this.__unittest.onlinefinish(this);
                }.bind(this));
            } else {
                this.evaluate();
            }

            return this;
        }

        this.evaluate = function() {
            switch (this.__method) {
                case "is":
                    if (((this.__expected === undefined) && (this.__assert != null)) || (!_.var.deepcompare(this.__assert, this.__expected))) {
                        this.failed = true;
                    }
                    break;

                case "isnot":
                    if (((this.__expected === undefined) && (this.__assert == null)) || (_.var.deepcompare(this.__assert, this.__expected))) {
                        this.failed = true;
                    }
                    break;

                case "has":
                    if (this.__result instanceof Array) {
                        if (!this.__result.includes(this.__expected)) {
                            this.failed = true;
                        }
                    } else if (typeof this.__result == "string") {
                        if (this.__result.indexOf(this.__expected) == -1) {
                            this.failed = true;
                        }
                    } else {
                        this.failed = true;
                    }
                    break;

                case "hasnot":
                    if (this.__result instanceof Array) {
                        if (this.__result.includes(this.__expected)) {
                            this.failed = true;
                        }
                    } else if (typeof this.__result == "string") {
                        if (this.__result.indexOf(this.__expected) != -1) {
                            this.failed = true;
                        }
                    } else {
                        this.failed = true;
                    }
                    break;

            }
        }

        this.debugout = function() {
            var result = (this.__failed? "FAIL: " : "PASS: ");

            result += this.__expected + " " + this.__method + " " + this.__expected + " - " + this.__message;
            return result;
        }
    })

    _.define.core.object("core.unittest", function() {
        this.__unittester = null;
        this.__modulename = null;
        this.__testname = null;
        this.__lines = null;

        this.__failedcount = 0;
        this.__promisecount = 0;

        this.__currentgroup = "";
        this.__source = null;
        
        this.construct = function(unittester, modulename, testname, source) {
            this.__unittester = unittester;
            this.__modulename = modulename;
            this.__testname = testname;
            this.__source = source;
            this.__lines = [];
        }

        this.group = function(groupname) {
            this.__currentgroup = groupname;
        }

        this.failedcount = function() { return this.__failedcount; }
        this.totalcount = function() { return this.__lines.length; }
        this.testname = function() { return this.__modulename + " - " + this.__testname; }
        this.source = function() { return this.__source; }

        this.test = function(assert) {
            var line = _.make.core.unittestline(this, this.__currentgroup || "", assert);
            if (_.ispromise(assert)) {   
                this.__promisecount++;
            }
            this.__lines.push(line);
            return line;
        }

        this.assert = function(assert, expected, message) {
            return this.test(assert).is(expected, message);
        }

        this.onlinefinish = function(line) {
            if (line.__failed) {
                this.__failedcount++;
            }
            this.__promisecount--;

            if (this.__promisecount == 0) {
                this.onfinish();
            }
        }

        this.onfinish = _.make.core.basicsignal()

        this.debugout = function(showall) {
            var result = []

            if ((!showall) && (this.__failedcount == 0)) { return; }

            result.push("")
            result.push("Unit test: " + this.__testname + " (" + this.__modulename + ")");

            var currentgroup = "";

            for (var i = 0; i < this.__lines.length; i++) {
                var line = this.__lines[i];

                if (line.__grouptitle !== currentgroup) {
                    currentgroup = line.__grouptitle;
                    if (currentgroup) { 
                        result.push("")
                        result.push("Group: " + currentgroup);
                    }
                }
                result.push(line.debugout());
            }

            return result;
        }
    })

    _.define.core.object("core.unittester", function() {
        this.__tests = null;
        this.__failedcount = 0;

        this.create = function() {
            var me = this
            me.__unittests = []

            _.foreach(_.core.__modules, function(module) {
                var modulename = module.fullpath()

                if (module._tests) { 
                    _.foreach(module._tests, function(test) {
                        var unittest = _.make.core.unittest(this, modulename, test.testname || "", test.source);
                        me.__unittests.push(unittest)
                    })
                }
            })
            return this
        }

        this.start = function() {
            //if (!this.__tests.length) { return this() }

            // _.foreach(this.__tests, function(test) {
            //     test.source().call(test, _)
            // })

            // this.onfinish()

            var me = this
                    
            _.foreachasync(this.__unittests, function(unittest, next) {
                unittest.source().call(unittest, _)
                if (unittest.__promisecount == 0) { 
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

        this.onfinish = _.make.core.basicsignal()

        this.debugout = function(showall) {
            var result = []

            for (var i = 0; i < this.__unittests.length; i++) {
                var unittest = this.__unittests[i];
                result = result.concat(unittest.debugout(showall));
            }    

            return result;
        }
    })


    var unittester = _.make.core.unittester(this)
        .create()
        .onfinish(function() {
            var result = unittester.debugout(true)

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
