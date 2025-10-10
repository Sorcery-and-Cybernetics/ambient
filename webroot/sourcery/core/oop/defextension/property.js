//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("property", function (_) {
    var makeproperty = function (def, modeldef) {
        var traitname = "_" + def._name
        modeldef[traitname] = def._initial

        return function (value) {            
            var me = this

            if (value === undefined) {
                value = me[traitname]

                if (value == null) {
                    var self = this.self()
                    if (self) { value = self[traitname] }
                } 

                if (def._onget) {
                    return def._onget.call(me, value)
                }
                return value
            }

            var oldvalue = me[traitname]

            if (oldvalue !== value) {
                if (def._onset) {
                    var result = def._onset.call(me, value, oldvalue)

                    if (result !== undefined) { value = result }
                }
                
                me[traitname] = value

                if (def._onchange) {
                    def._onchange.call(me, value, oldvalue)                

                } else if (me.setdirty) {
                    me.setdirty(def)
                }
            }

            return me
        }
    }

    var makemapproperty = function (def, proto) {
        var traitname = "_" + def._name

        return function (name, value) {
            var me = this
            var map = me[traitname]

            if (!map) {
                map = {}
                me[traitname] = map
            }

            if (!name) { return map }

            var storedvalue = map[name]

            if (value === undefined) {
                if (def._onget) {
                    return def._onget.call(me, name, storedvalue)
                }
                return storedvalue
            }

            if (storedvalue !== value) {
                if (def._onset) {
                    var result = def._onset.call(me, name, value, storedvalue)
                    if (result !== undefined) { value = result }
                }

                if (value == null) {
                    delete map[name]
                } else {
                    map[name] = value
                }

                if (def._onchange) {
                    def._onchange.call(me, name, value, storedvalue)

                } else if (me.setdirty) {
                    me.setdirty(def)
                }
            }

            return me
        }
    }

    //The list is a bit complex. It does smart storage, only converting to an array when needed.
    //It has some extra added magick to function as a stack. -1 will point to the last item. Deleting a last item can be done by calling the function as (-1, null)
    var makelistproperty = function (def, proto) {
        var traitname = "_" + def._name

        return function (index, value) {
            var me = this
            var list = me[traitname]

            if (!index) {
                if (!list) { return null }
                if (!_.isarray(list)) { return [list] }
                return list
            }            

            var storedvalue = (list !== undefined? (_.isarray(list)? (index == -1? list[list.length - 1]: list[index - 1]): list): undefined)

            if (value === undefined) {
                if (def._onget) {
                    return def._onget.call(me, index, storedvalue)
                }
                
                return storedvalue
            }

            if (index == -1) { 
                if (value == null) {
                    if (_.isarray(list)) {
                        list.pop()
                        if (list.length == 0) { me[traitname] = null }
                    } else {
                        me[traitname] = null
                    }

                    if (def._onchange) {
                        def._onchange.call(me, -1)                    

                    } else if (me.setdirty) {
                        me.setdirty(def)
                    }
                    
                    return me

                } else {

                    index = (!list || !_.isarray(list)? 1: list.length + 1)
                }
            } 
            
            if (storedvalue !== value) {

                if (def._onset) {
                    var result = def._onset.call(me, index, value, storedvalue)

                    if (result !== undefined) { value = result }
                }

                if (!list) {
                    if (index == 1) {
                        me[traitname] = value
                    } else {
                        list = []
                        me[traitname] = list
                        list[index - 1] = value
                    }
                } else {
                    if (!_.isarray(list)) {
                        list = [storedvalue]
                        me[traitname] = list
                    } 
                    list[index - 1] = value
                }

                if (def._onchange) {
                    def._onchange.call(me, index, value, storedvalue)

                } else if (me.setdirty) {
                    me.setdirty(def)
                }
            }

            return me
        }
    }

    _.define.defextender("property", function(supermodel) {
        this._initial = null

        this.construct = function(initial) {
            this._initial = initial
        }

        this.definetrait = function (modeldef, traitname) {
            this._parent = modeldef
            this._name = traitname

            var result

            switch (this._as) {
                case "map":
                    result = makemapproperty(this, modeldef)
                    break

                case "list":
                    result = makelistproperty(this, modeldef)
                    break
                
                default:
                    result = makeproperty(this, modeldef)
            }

            result.definition = this
            return result            
        }

        this.onget = function (fn) {
            this._onget = fn
            return this
        }

        this.onset = function (fn) {
            this._onset = fn
            return this
        }

        this.onchange = function (fn) {
            this._onchange = fn
            return this
        }        
    })
})