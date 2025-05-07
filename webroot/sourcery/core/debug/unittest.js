_.ispromise = function(obj) {
    return (typeof obj == "object" && typeof obj.then == "function");
}

_.define.core.object("core.unittesttest", function(_) {
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

    this.contains = function(expected, message) {
        return this.assert("contains", expected, message);
    }

    this.doesnotcontain = function(expected, message) {
        return this.assert("doesnotcontain", expected, message);
    }

    this.assert = function(method, expected, message) {
        this.__method = method;
        this.__expected = expected;
        this.__message = message;

        if (_.ispromise(this.__assert)) {
            this.__assert.then(function(value) {
                this.__assert = value;
                this.evaluate();
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

            case "contains":
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

            case "doesnotcontain":
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

        this.__unittest.onlinefinish(this);
    }

    this.debugout = function() {
        var result = this.__grouptitle + " | " + this.__method + " | " + this.__message + " | " + this.__result + " | " + this.__expected;
        if (this.__failed) {
            result += " | failed";
        } else {
            result += " | passed";
        }
        return result;
    }
})

_.define.core.object("core.unittest", function(_) {
    this.__unittester = null;
    this.__modulename = null;
    this.__title = null;
    this.__lines = null;

    this.__failedcount = 0;
    this.__promisecount = 0;

    this.__currentgroup = "";
    
    this.construct = function(unittester, modulename, title) {
        this.__unittester = unittester;
        this.__modulename = modulename;
        this.__title = title;
        this.__lines = [];
    }

    this.group = function(groupname) {
        this.__currentgroup = groupname;
    }

    this.expect = function(assert) {
        var line = _.make.core.unittesttest(this, this.__currentgroup || "", assert);
        if (_.ispromise(assert)) {   
            this.__promisecount++;
        }
        this.__lines.push(line);
        return line;
    }

    this.assert = function(assert, expected, message) {
        return this.expect(assert).is(expected, message);
    }

    this.ontestfinish = function(line) {
        if (line.__failed) {
            this.__failedcount++;
        }
        this.__promisecount--;

        if (this.__promisecount == 0) {
            this.__unittester.ontestfinish(this);
        }
    }

    this.debugout = function(showall) {
        var result = []

        if ((!showall) && (this.__failedcount == 0)) { return; }

        result.push("")
        result.push((this.__title? "Unit test: " + this.modulename + " - " + this.__title: ""));

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

_.define.core.object("core.unittester", function(_) {
    this.__scope = null;
    this.__tests = null;

    this.construct = function(scope) {
        this.__scope = scope;
        this.__tests = [];
    }

    this.starttest = function(modulename, title, module) {

        var unittest = _.make.core.unittest(this, modulename, title);
        this.__tests.push(unittest);
        module.call(unittest, this.__scope);
        return this;
    }

    this.onfinish = function(callback) {
        this.__calback = callback;
        return this
    }

    this.ontestfinish = function(unittest) {
        this.__calback(unittest);
    } 
    
    this.debugout = function(showall) {
        var result = []

        for (var i = 0; i < this.__tests.length; i++) {
            var unittest = this.__tests[i];
            result = result.concat(unittest.debugout(showall));
        }    

        return result;
    }
})


