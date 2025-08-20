//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("oophelper", function (_) {
    _.define.helper("oop", function() {
        this.definers = null
        this.defined = false

        this.construct = function () {
            this.definers = {}
        }

        this.striparguments = function (fn) {
            var paramstr = _.innercut$(fn.toString(), "(", ")")

            return _.splittrim$(paramstr)
        } 
        
        this.addmodeldefiner = function(modelname, definer) {
            this.definers[modelname] = definer

            if (this.defined) {
                definer = new definer()
                //_.debug("Later Making", definer.babyname, definer.supermodelname)
                definer.make()
            }
        }

        this.getmodeldefiner = function(modelname) {
            return this.definers[modelname]
        }

        this.rundefiners = function() {
            this.defined = true
            _.foreach(this.definers, function(modeldefiner) {
                var definer = new modeldefiner()                        
                //_.debug("Making", definer.babyname, definer.supermodelname)

                switch (definer.modelname()) {
                    case "object":
                    case "modeldefiner":                        
                        break

                    default:
                        definer.make()
                }
            })
        }

        this.addvalue = function (json, name, value) {
            var cursor = json
            var parts = name.split(".")

            if (json[name]) { throw "helper.oop.appendvalue: Value " + name + " already exists" }   
            json[name] = value

            if (parts.length > 1) {
                for (var index = 0; index < parts.length; index++) {
                    var namepart = parts[index]

                    if (index < parts.length - 1) {
                        if (!cursor[namepart]) {
                            cursor[namepart] = {}
                        }
                        cursor = cursor[namepart]

                    } else {
                        var jsonvalue = cursor[namepart]

                        if (jsonvalue) {
                            if (_.isjson(jsonvalue)) {
                                //transfer all keys from jsonvalue to json
                                _.json.merge(value, jsonvalue)
                            } else {
                                throw "helper.oop.appendvalue: Value " + name + " already exists"
                            }
                        }
                        cursor[namepart] = value
                    }
                }
            }
        }

        this.getvalue = function(json, name) {
            var cursor = json
            var parts = name.split(".")

            for (var index = 0; index < parts.length; index++) {
                var namepart = parts[index]

                if (index < parts.length - 1) {
                    if (!cursor[namepart]) {
                        return null
                    }
                    cursor = cursor[namepart]
                } else {
                    return cursor[namepart]
                }
            }
        }

        this.addmaker = function (name, model) {
            var maker = function () {
                var object = new model()
                object.construct.apply(object, arguments)
                return object
            }
            maker.prototype = model.prototype
            
            this.addvalue(_.model, name, maker)
            return maker
        }

        this.getmaker = function(name) {
            return this.getvalue(_.model, name)
        }

        this.getmodel = function(name) {
            return this.getvalue(_.model, name)
        }

        this.getdefiner = function(name) {
            return this.getvalue(_.define, name)
        }

        this.mergetraitdef = function (targetdef, superdef) {
            for (propertyname in superdef) {
                value = superdef[propertyname]

                if (superdef.hasOwnProperty(propertyname)) {
                    switch (propertyname) {
                        case "_proto_":
                            throw "error"

                        default:
                            if (_.isarray(value)) {
                                if (targetdef[propertyname]) {
                                    targetdef[propertyname] = value.concat(targetdef[propertyname])
                                } else {
                                    targetdef[propertyname] = value.slice(0)
                                }

                            } else if (!targetdef.hasOwnProperty(propertyname)) {
                                targetdef[propertyname] = value

                            } else {
                                throw "Nothing to merge"
                            }
                    }
                }
            }
            return targetdef
        }

        //traitdef is an object, we turn it into a model. We add a function to modeldef that returns an instance of the trait
        this.addmodeltrait = function(modeldef, traitname, traitdef) {
            if (traitdef._phase) { throw "error: trait should not have been assigned." }

            if (modeldef[traitname]) {
                var supertrait = modeldef[traitname].traitmodel
                var traitoverride = true
            } else {
                var traitoverride = false
            }
            
            var traitmodel = function() { }

            traitmodel.prototype = traitdef
            traitmodel.prototype._modelname = traitname
            traitmodel.prototype._supermodel = supertrait || traitdef._supermodel
            traitmodel.prototype._definition = traitmodel

            var internalname = "_" + traitname

            var method = function () {
                if (!this[internalname]) {
                    this[internalname] = new traitmodel().assign(this, traitname)
                }

                return this[internalname]
            }
            method.name = traitname
            method.traitmodel = traitmodel          

            modeldef[traitname] = method
        }

        this.adddefextendertrait = function (modeldef, traitname, traitdef) {
            //Defextender traits are not allowed to override existing traits
            var currenttrait = modeldef[traitname]
            if (currenttrait) {
                if (!currenttrait.definition || !currenttrait.definition.iscompatible(traitdef)) { throw "error: duplicate trait in model: " + modeldef._modelname + ", trait: " + traitname }
                traitdef.inherit(currenttrait.definition)
            }

            var method = traitdef.definetrait(modeldef, traitname)
            if (!_.isfunction(method)) {  throw "error: method expected from definetrait" }
            
            method.name = traitname
            modeldef[traitname] = method
        }

        this.extendmodeldef = function (modeldef, extenddef, duplicatewarn) {
            for (var traitname in extenddef) {
                if (extenddef.hasOwnProperty(traitname)) {
                    
                    switch (traitname) {
                        case "_parent":
                        case "_modelname":
                        case "_supermodel":    
                        case "_phase":
                        case "_definition":
                        case "_self":                 
                            //Filter out protected keys
                            break

                        default:
                            var traitdef = extenddef[traitname]
                            var modeltrait = modeldef[traitname]

                                
                            if (_.isobject(traitdef)) { //def extender object
                                if (_.isfunction(traitdef.definetrait)) {
                                    this.adddefextendertrait(modeldef, traitname, traitdef)

                                } else {
                                    this.addmodeltrait(modeldef, traitname, traitdef)
                                }

                            } else if (modeltrait && _.isjson(traitdef)) {
                                if (!_.isjson(modeltrait)) { throw "error" }
                                modeldef[traitname] = _.merge(modeltrait || {}, traitdef)                                

                            } else {
                                modeldef[traitname] = traitdef
                            }
                    }
                }
            }
        }        

        this.makemodel = function (name, supermodel, modeldef) {
            if (_.isfunction(modeldef)) { 
                var context = {}

                modeldef = modeldef.call(context, supermodel.prototype) 
                if (modeldef) { throw "oophelper.makemodel: No return value allowed." }
                modeldef = context

            } else {
                modeldef = modeldef || {}
            }
    
            if (!modeldef.construct && !supermodel) { modeldef.construct = _.noop }
            
            //Inheritance the classic javascript way. 
            var model = function () { }

            if (supermodel) {
                function clone() { }
                clone.prototype = supermodel.prototype
                model.prototype = new clone()
            }            

            //flatten behaviors into prototype
            for (var key in modeldef) {
                var trait = modeldef[key]

                if (trait && (trait._modelname == "behavior")) {
                    delete modeldef[key]

                    if (_.isfunction(trait) && trait._modelname == "behavior") {
                        trait = _.behavior[key]
                    }

                    for (var behaviorkey in trait) {
                        if (behaviorkey != "_modelname") {
                            if (modeldef[behaviorkey]) { throw "error: duplicate trait in model: " + name + ", behavior: " + key + ", trait: " + behaviorkey }
                            modeldef[behaviorkey] = trait[behaviorkey]
                        }
                    }
                }
            }
    
            //extend the prototype
            model.prototype._modelname = name
            this.extendmodeldef(model.prototype, modeldef, true)
            model.prototype._supermodel = supermodel
    
            return model
        }
        
        this.overwritemodel = function(name, modeldef) {
            if (_.isfunction(modeldef)) { 
                var context = {}
                modeldef = modeldef.call(context) 
                if (modeldef) { throw "oophelper.overwritemodel: No return value allowed." }
                modeldef = context
            }

            var model = this.getmodeldefiner(name)
            _.json.merge(model.prototype, modeldef)
            return model
        }
        
        this.adddefiner = function(supermodelname) {
            var me = this

            me.addvalue(_.define, supermodelname, function (modelname, modeldef) {
                var superdefiner = me.getmodeldefiner(supermodelname)
                var definermodel = me.makemodel(modelname, superdefiner, null)

                definermodel.prototype.init(supermodelname, modelname, modeldef)
//                
                me.addmodeldefiner(modelname, definermodel)
                me.adddefiner(modelname)
    
                var definer = new definermodel()
    
                return definer
            })
        }

        this.addmodel = function (modelname, supermodelname, modeldef) {
            var supermodel = this.getmodel(supermodelname)
            var model = this.makemodel(modelname, supermodel, modeldef)

            this.addmaker(modelname, model)

            return model
        }
        
        this.delmodel = function(modelname) {
            delete _.model[modelname]
            delete _.define[modelname]
            delete this.definers[modelname]

            return this
        }
    })   
})