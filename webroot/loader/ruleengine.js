//*************************************************************************************************
// ruleengine - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function (_) {
    var validaterule = function (me, filter, isrequired) {
        function validatetoken(test) {
            test = _.trim$(test)

            if (test.slice(0, 1) == "!") {
                test = test.slice(1)
                if (test == "require") { return !isrequired }
                return !me.hasrole(test.slice(1))
            }

            if (test == "require") { 
                return !!isrequired } 
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

    _.define.object("roleengine", function () {
        return {
            construct: function() {
                this.role = {}
            }

            , addrole: function (role) {
                this.role[role] = true
                return this
            }
                    
            , hasrole: function (role) {
                if (role.substr(0, 1) == "!") {
                    return !this.role[role.substr(1)]
                } else {
                    return !!this.role[role]
                }
            }
                    
            , delrole: function (role) {
                if (this.hasrole(role)) { delete this.role[role] }
                return this
            }
                    
            , checkrule: function (rule, isrequired) {
                var me = this
                        
                if (!rule) { return true }

                if (_.isarray(rule)) {
                    var result = true
                            
                    _.foreach(rule, function (rule) {
                        if (!me.checkrule(rule, isrequired)) { result = false }
                    })
                    return result
                }
                        
                if (_.isfunction(rule)) {
                    rule = rule()
                }
                        
                return validaterule(this, rule, isrequired)
            }            

        }
    })


}) (_.ambient)