//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

//todo: Lazy implement error object, depending on debug mode settings, not all is necessary to parse. Turn all properties into traits.
_.ambient.module("error").source(function (_) {
    _.define.object("error", function () {
        var argumentstostring = function (args) {
            if (!args) { return "" }

            var result = []

            for (var index = 0; index < args.length; index++) {
                var arg = args[index]

                if (_.isobject(arg)) {
                    arg = "{object}"
                } else if (_.isarray(arg)) {
                    arg = "{array:" + arg.length + "}"
                } else if (_.isfunction(arg)) {
                    arg = "{function}"
                } else if (_.isobject(arg)) {
                    arg = "{" + arg.modelname() + (arg.uid? _.paste$("@", _.normalize(arg.uid, arg)): "") + "}"
                } else {
                    arg = _.cstr(arg)
                }

                result.push(arg)
            }

            return result
        }

        var makemessage = function (me) {
            var message = ""

            switch (me.level) {
                case 0:
                    me.type = "LOG"
                    break
                case 1:
                    me.type = "INFO"
                    break
                case 2:
                    me.type = "WARNING"
                    break
                case 3:
                    me.type = "NOTIFY"
                    break
                case 4:
                    me.type = "ERROR"
                    break
                case 5:
                    me.type = "CRITICAL"
                    break

                default: 
                    me.type = "ERROR"
            }

            //var message = me.type + ": "

            if (me.itemmodel) {
                if (me.funcname) {
                    message += me.itemmodel ? "." : "_."
                    message += me.funcname
                } else {
                    message += me.itemmodel
                }
            }

            if (me.arguments && me.funcname) {
                message += "(" + _.join$(me.arguments, ", ") + ")"
            }

            if (message) { message += " - " }
            message += me.description

            me.message = message
        }


        this.itemmodel = ""
        this.itemname = ""
        this.itemid = 0
        this.funcname = ""
        this.description = ""
        this.stack = ""
        this.filename = ""
        this.linenumber = ""
        this.arguments = undefined
        this.level = 0
        this.type = ""
        this.message = ""

        this.construct = function (description) {
            if (!description) {
                this.description = "error"

            } else if (description.constructor == Error) {
                this.description = description.message
                if (description.stack) { this.stack = description.stack }
                if (description.fileName) { this.filename = description.fileName }
                if (description.lineNumber) { this.linenumber = description.lineNumber }

            } else {
                this.description = _.cstr(description)

                this.level = 3

                makemessage(this)
            }

            this.errorinfo = function (model, funcname, args, level) {
                if (model) {
                    if (model.modelname()) {
                        this.itemmodel = model.modelname()
                        this.itemname = _.normalize(model.key, model) || _.normalize(model.name, model) || ""
                        this.itemid = _.normalize(model.uid, model) || ""
                    } else {
                        this.itemmodel = _.cstr(model)
                    }
                }

                this.funcname = _.cstr(funcname) || ""
                this.arguments = argumentstostring(args)
                this.level = _.cint(level)

                makemessage(this)

                return this
            }

            this.asjson = function () {
                return {
                    itemmodel: this.modelname
                    , itemname: this.aliasname
                    , itemid: this.aliasuid
                    , funcname: this.funcname
                    , description: this.description
                    , stack: this.stack
                    , filename: this.filename
                    , linenumber: this.linenumber
                    , arguments: this.arguments
                    , level: this.level
                    , type: this.type
                    , message: this.message
                }
            }
        }

        var doerror = function (me, obj, funcname, args, description, level) {
            var error = _.model.error(description)
                .errorinfo(obj, funcname, args, level)

            _.debug.write(false, error.type, error.message)

            if (_.dom) { _.dom.notifyerror(error) }

            return error
        }

        _.system.debugmode = false

        _.system.debug = function (obj, funcname, args, description) {
            return doerror(this, obj, funcname, args, description, 0)
        }

        _.system.info = function (obj, funcname, args, description) {
            return doerror(this, obj, funcname, args, description, 1)
        }

        _.system.warn = function (obj, funcname, args, description) {
            return doerror(this, obj, funcname, args, description, 2)
        }

        _.system.notify = function (obj, funcname, args, description) {
            return doerror(this, obj, funcname, args, description, 3)
        }

        _.system.error = function (obj, funcname, args, description) {
            return doerror(this, obj, funcname, args, description, 4)
        }

        _.system.critical = function (obj, funcname, args, description) {
            return doerror(this, obj, funcname, args, description, 5)
        }    
    })
})