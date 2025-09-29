_.define.aliaskind("shell", function (supermodel) {
    return {
        globals: null
        , actions: null
       
        , initialglobals: null

        , create: function () {
            supermodel.create.apply(this, arguments)

            this.actions = {}
        }

        , load: function (globals, actions) {
            this.initialglobals = globals || this.initialglobals || {}
            this.actions = actions || this.actions || {}
            this.clear()
            return this
        }

        , clear: function () {
            this.globals = _.clone(this.initialglobals) //todo: import
            return this
        }

        , setglobal: function (name, value, raiseevent) {
            //todo: vartype check?

            if (_.json.set(this.globals, name, value)) {
                if (raiseevent !== false) {
                    this.raise("globalchanged", null, { name: name, value: value })
                }
            }
        }

        , toggleglobal: function (name, value) {
            this.setglobal(name, value === undefined ? !this.getglobal(name) : _.cbool(value))
        }

        , getglobal: function (name) {
            if ((_.right$(name, 1) == "*") || _.isarray(name)) {
                //todo: ????
                return _.clone(this.globals)
            }
            return _.clone(_.json.get(this.globals, name))
        }

        , validateglobal: function (filter) {
            return _.scripting.validateglobal(this, filter)
        }

        , hasaction: function (actionname) {
            return !!_.json.get(this.actions, actionname)
        }

        , doaction: function (name, params) {
            var me = this

            var action = _.json.get(me.actions, name)
            if (!action) { throw _.debug.error(me, "doaction", arguments, "Action doesn't exist") }

            var definition = _.scripting.actiondefinition(name, action)

            //BUG: Sometimes we have an dock:clientsession without a personuid ! help !
            var server = _.koachserver  || _.groupserver //TODO: Enable for groupserver
            if (server && definition.rule && definition.rule()) {
                var person = server.db.getnode(this._parent.personuid)
                if (!definition.checkrule(person, params)) {
                    throw _.debug.error(this, name, _.json.values(params), "No Access")
                }
            }

            //match arguments with definition
            var args = []

            _.foreach(definition.paramnames, function (paramname, index) {
                args.push(_.undef(params[paramname], null))
            })

            return action.apply(me, args)
        }


        , onreset: _.signal()
        , onglobalchanged: _.signal()

    }
})

//.addtest("test 1", function () {
//    var data = _.make.shell().load({
//        vars: {
//            bool: false
//            , number: 2
//            , string: "abc"
//        }
//    })

//    data.onglobalchanged(function (change) {
//        var x = change
//    })

//    if (data.getglobal("vars.bool") !== false) { throw "" }
//    if (data.getglobal("vars.number") !== 2) { throw "" }

//    data.toggleglobal("vars.bool")
//    data.setglobal("vars.number", 4)

//    if (data.getglobal("vars.bool") !== true) { throw "" }
//    if (data.getglobal("vars.number") !== 4) { throw "" }

//    if (data.validateglobal("vars.number != 4")) { throw "" }
//    if (data.validateglobal("vars.number != 4 && !vars.bool")) { throw "" }

//})