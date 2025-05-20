//*************************************************************************************************
// oophelper - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
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

        this.registerdefiner = function(definer) {
            this.definers[definer.babyname] = definer

            if (this.defined) {
//                _.debug("Making", definer.babyname, definer.supermodelname)
                definer.make()
            }
        }

        this.rundefiners = function() {
            this.defined = true
            _.foreach(this.definers, function(definer) {
                definer.make()
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
                                cursor[namepart] = null
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

        this.definetrait = function(modeldef, traitname, traitdef) {
            var trait = traitdef.definetrait(modeldef, traitname)

            modeldef[traitname] = trait
        }

        this.extendmodeldef = function (modeldef, extenddef, duplicatewarn) {

            for (var traitname in extenddef) {
                if (extenddef.hasOwnProperty(traitname)) {
                    
                    switch (traitname) {
                        case "_modelname":
                        case "_definition":
                            //Filter out protected keys
                            break

                        default:
                            var traitdef = extenddef[traitname]
                            //todo: What to do with json?
                            //for now the warning, in the future, we can merge the traits
                            // if (duplicatewarn && modeldef[traitname]) {
                            //     _.debug("Duplicate trait " + traitname + " in " + modeldef._modelname)
                            // }

                            //todo: recognizing what a trait definition is, should go through definition. Or we need a standard way how to define and construct traits
                            if (traitdef && _.isfunction(traitdef.definetrait)) {
                                this.definetrait(modeldef, traitname, traitdef)

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

            var model = this.getmodel(name)
            _.json.merge(model.prototype, modeldef)
            return model
        }
        
        this.adddefiner = function(supermodelname) {
            var me = this

            me.addvalue(_.define, supermodelname, function (modelname, modeldef) {
                var superdefiner = me.getmodel("definer." + supermodelname)
                var definermodel = me.makemodel(modelname, superdefiner, null)

                var definer = new definermodel()

                definermodel.prototype.init(supermodelname, modelname, modeldef)

                me.addvalue(_.model, "definer." + modelname, definermodel)
                me.adddefiner(modelname)
    
                var definer = new definermodel()
                me.registerdefiner(definer)
    
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