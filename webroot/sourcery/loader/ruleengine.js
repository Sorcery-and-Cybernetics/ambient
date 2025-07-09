//****************************************************************************************************************************
// Ambient - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("ruleengine", function(_) {
    var validaterule = function(me, filter, isrequired) {
        function validatetoken(test) {
            test = _.trim$(test)
            if (test.slice(0, 1) == "!") {
                test = test.slice(1)
                if (test == "require") { return !isrequired }
                return !me.hasrole(test.slice(1))
            }
            if (test == "require") { return !!isrequired }
            return !!me.hasrole(test)
        }

        function validateline(line) {
            var lines = _.split$(line, "&&")
            for (var index = 0; index < lines.length; index++) {
                if (!validatetoken(lines[index])) { return false }
            }
            return true
        }

        var lines = _.split$(filter, "||")
        for (var index = 0; index < lines.length; index++) {
            if (validateline(lines[index])) { return true }
        }
        return false
    }

    _.define.object("ruleengine", function() {
        this.construct = function() { this.role = {} }
        this.addrole = function(role) { this.role[role] = true; return this }

        this.hasrole = function(role) {
            if (role.substr(0, 1) == "!") { 
                return !this.role[role.substr(1)] 
            } else { 
                return !!this.role[role] 
            }
        }

        this.delrole = function(role) { if (this.hasrole(role)) { delete this.role[role] } return this }

        this.checkrule = function(rule, isrequired) {
            var me = this

            if (!rule) { return true }

            if (_.isarray(rule)) {
                var result = true
                _.foreach(rule, function(rule) { if (!me.checkrule(rule, isrequired)) { result = false } })
                return result
            }

            if (_.isfunction(rule)) { rule = rule() }
            return validaterule(this, rule, isrequired)
        }
    })
})
