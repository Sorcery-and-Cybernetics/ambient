_.define.alias("aliaslist", function (supermodel) {
    return {
        _definition: null
        , _isaugment: undefined
        , _issnapshot: false
        , sortlist: null

        , uidmap: null
        , _keymap: null
        , _sortby: null

        //TODO: see if we can integrate with the  _uid ?
        , liveuid: function () {
            return this.parent().uid() + "." + this.key()
        }

        , lifecyclebehavior: _.behavior({
            create: function (parent, key, orderindex, value, uid) {
                if (orderindex) { throw "error" }

                var definition = parent? parent.traitdef(key): null

                if (definition) {
                    if (parent instanceof _.kind.aliasroot) {
                        uid = "root." + key
                    } else if (parent.uid()) {
                        uid = parent.uid() + "." + key
                    }
                }

                var initialvalue

                if (value && (value.isaugment != null)) {
                    initialvalue = { isaugment: value.isaugment, self: value.self }
                }

                supermodel.create.apply(this, [parent, key, orderindex, initialvalue, uid])

                if (!this._isaugment) {
                    var sortby = definition ? definition.sortby() : null

                    if (sortby) {
                        this._sortby = sortby
                        this.nodes = _.make.sortedlist(this, sortby)
                    } else {
                        this.nodes = _.make.orderedlist(this)
                    }
                } else {
                    this.nodes = _.make.map(this, "nodemap")
                }

                this._keymap = _.make.map(this, "keymap")
                if (value) { this.fromjson(value) }
            }

            , ondestroy: function () {
                if (this.sortlist) {
                    _.foreach(this.sortlist, function (sort) {
                        sort.destroy()
                    })
                }
                if (this.parent()) { this.parent()._my.del(this.key()) }
            }
        })

         , basebehavior: _.behavior({
            sortby: function () {
                return this._sortby
            }

            , primarykey: function () {
                return null
            }
         })

        , onchange: function (event) {
            if (event.traitname == "self") {

                if (!!this._isaugment == !!this.self()) {
                    //we already have the right internal nodelist
                } else {
                    //we need to replace node list
                    this.clear()
                }
            }
        }

        , definitionbehavior: _.behavior({
            definition: function (traitname) {
                var me = this

                switch (traitname) {
                    case "*":
//                        _.debug("Error: Wrong use of definition in aliaslist. Warn andrew")
                        return me._definition

                    case "":
                    case null:
                    case undefined:
                        if (me._parent) {
                            return me._parent.definition(this._key)
                        }
                        return null
                    default:
//                        _.debug("Error: Wrong use of definition in aliaslist. Warn andrew")
                        return me._definition[traitname]
                }
            }
        })

        , augmentbehavior: _.behavior({
            isaugment: function () {
                return this._isaugment
            }

            , remake: function (item) {
                if (!item) { return null }

                var uid = item.uid()

                if (!this.nodes.get) {
                    _.debug.warn(me, "aliaslist.remake", null, "Nodemap doesn't exist")
                    this.clear()
                }

                var result = this.nodes.get(uid)

                if (!result) {
                    result = _.make[item.model()](this, item.key(), null, item)
                } else {
                    if (!result.self()) {
                        result.self(item)
                        _.debug.warn(this, "aliaslist.remake", null, "Existing augment without self found.")
                    }
                }

                return result
            }
        })

        , childbehavior: _.behavior({
            add: function (item) {
                if (this._snapshot) { return this }
                var me = this
                var uid = item.uid()

                //if (item._owner) {
                //    throw "error"
                //}

                if (this.isaugment()) {
                    var itemself = item.self()

                    if (!itemself) {
                        item.onchange(function (event) {
                            if (event.traitname == "self" && event.source == item) {
                                if (!item.self()) { throw "error" }
                                me.add(item)
                                return _.remove
                            }
                        })
                        return this
                    }

                    var selfuid = itemself.uid()
                    //HACK:
                    if (!this.nodes.set) {
                        this.nodes = _.make.map(this, "nodemap")
                    }
                    this.nodes.set(selfuid, item)

                } else {
                    this.nodes.push(item)
                }

                var key = item.key()
                if (key) { this._keymap.set(key, item) }

                item._db = this._db
                item._parent = this._parent || this
                item._owner = this

                // The alias will call this.raisechildchange() 

                return this
            }

            , del: function (item) {
                if (this._snapshot) { return this }
                var key = item.key()
                var me = this
                if (key) { this._keymap.del(key) }

                if (this.nodes instanceof _.kind.map) {
                    this.nodes.foreach(function (localitem, key) {
                        if (item == localitem) {
                            me.nodes.del(key)
                            return _.done
                        }
                    })

                }
                return this
            }

            , get: function (key) {
                return this._keymap.get(key)
            }

            , has: function (key) {
                return this._keymap.has(key)
            }

            , getitem: function (position) {
                if (this.isaugment()) {
                    return this.remake(this.self().getitem(position))
                } else {
                    return this.nodes.getitem(position)
                }
            }

            , getitembyuid: function (uid) {
                if (this.isaugment()) {
                    var item = this.db().getnode(uid)
                    if (item && (item.owner() == this.self())) {
                        return this.remake(item)
                    }
                } else {
                    var item = this.db().getnode(uid)
                    if (item && (item.owner() == this)) { return item }
                }
                return null
            }

            , clear: function () {
                var me = this
                var db = this.db()

                this._snapshot = false

                if (this.nodes && this.nodes.length()) {
                    this.nodes.foreach(function (item) {
                        if (item.owner() == me) { item.delete() }
                    })
                    this.nodes.clear()
                }

                if (this._isaugment || this.hasself()) {
                    if (this.nodes && !(this.nodes instanceof _.kind.map)) {
                        this.nodes = this.nodes.destroy()
                    }

                    if (!this.nodes) {
                        this.nodes = _.make.map(this, "nodemap")
                        this._isaugment = true
                    }

                } else {
                    if (this.nodes && !(this.nodes instanceof _.kind.orderedlist)) {
                        this.nodes = this.nodes.destroy()
                    }

                    if (!this.nodes) {
                        this.nodes = _.make.orderedlist(this)
                        this._isaugment = false
                    }
                }
            }

            , length: function () {
                return this.count()
            }

            , count: function () {
                var self = this.self()

                if (self) {
                    return self.length ? self.length() : 0
                } else {
                    return this.nodes ? this.nodes.length() : 0
                }
            }

            , insertafter: function (cursor, item) {
                if (this._snapshot) { return this }

                if (this.isaugment()) {
                    this.add(item)
                } else {
                    this.nodes.insertafter(cursor, item)
                }
                // The alias will call this.raisechildchange() 
                return this
            }

            , insertbefore: function (cursor, item) {
                if (this._snapshot) { return this }

                if (this.isaugment()) {
                    this.add(item)
                } else {
                    this.nodes.insertbefore(cursor, item)
                }
                // The alias will call this.raisechildchange() 
                return this
            }

            , import: function (model, data) {
                    var reuid = function (db, data) {
                        var references = {}

                        _.json.foreach(data, function (value, key, base) {
                            if (key == "uid") {
                                var uid = db.makeuid()
                                if (references[value]) {
                                    throw "Error: duplicate uid: " + value
                                }
                                references[value] = uid
                                base[key] = uid
                            }
                        }, true)

                        _.json.foreach(data, function (value, key, base) {
                            if (_.left$(value, 1) == "@") {
                                var uidvalue = _.right$(value, value.length - 1)
                                if (uidvalue) {
                                    var uid = references[uidvalue]
                                    if (uid) {
                                        base[key] = "@" + uid
                                    }
                                }
                            } else if (references[key] != undefined) {
                                if (base[key] == value) {
                                    delete base[key]
                                    base[references[key]] = value
                                } else {
                                    throw "Error"
                                }
                            }
                        }, true)

                        return data
                    }

                    reuid(this._db, data)
                    data.next = null
                    data.prev = null
                    newnode = _.make[model](this, model, null, data)

                    return newnode
            }

            , onchildchange: _.signal()


        })

        , childlistbehavior: _.behavior({
            isinlist: function (item) {
                return (item._indexof && (item._indexof._list == this.nodes)) 
            }

            , getnext: function (item) {
                if (this.isaugment()) {
                    var self = item.self()
                    if (!self) { return null }

                    return this.remake(self.next())

                } else {
                    if (!this.isinlist(item)) { return null }

                    var nextnode = item._indexof.next()
                    return nextnode ? nextnode.value() : null
                }
            }

            , getprev: function (item) {
                if (this.isaugment()) {
                    var self = item.self()
                    if (!self) { return null }

                    return this.remake(self.prev())

                } else {
                    if (!this.isinlist(item)) { return null }

                    var prevnode = item._indexof.prev()
                    return prevnode ? prevnode.value() : null
                }
            }

            , first: function () {
                if (this.isaugment()) {
                    var first = this.self().first()
                    return this.remake(first)
                } else if(this.nodes) {
                    return this.nodes.first()
                }
                return null
            }

            , last: function () {
                if (this.isaugment()) {
                    return this.remake(this.self().last())
                } else {
                    return this.nodes.last()
                }
            }

            //todo: In the future we want to support multiple sortby keys
            //, sortby: function (key) {
            //    if (!this.sortlist) { this.sortlist = {} }

            //    if (!this.sortlist[key]) {
            //        this.sortlist[key] = _.make.aliasview(this, key)
            //    }

            //    return this.sortlist[key]
            //}

            , findfirst: function (fieldname, search, comparison) {
                return this.for().wherekey(fieldname, search, comparison).first()
            }

            , for: function (fn) {
                if (fn) {
                    return this.foreach(fn)
                } else {
                    return _.make.lazyfilterroot(this)
                }
            }

            , rof: function (fn) {
                if (fn) {
                    return this.rofeach(fn)
                } else {
                    return _.make.lazyfilterroot(this, true)
                }
            }

            , foreach: function (fn) {
                if (fn) {
                    _.make.lazyfilterroot(this).do(fn)
                }
                return this
            }
              , rofeach: function (fn) {
                  if (fn) {
                      _.make.lazyfilterroot(this, true).do(fn)
                  }
                  return this
              }
        })

        , raisechildchange: function (changeevent) {
            switch (changeevent.name) {
                case "change":
                    switch (changeevent.traitname) {
                        case "key":
                            if (changeevent.oldvalue) {
                                this._keymap.del(changeevent.oldvalue)
                            }
                            if (changeevent.value) {
                                this._keymap.set(changeevent.value, changeevent.source)
                            }
                            break

                        default:
                            this.onchildchange(changeevent)
                            break
                    }
                    break
                case "del":
                    var key = changeevent.source ? changeevent.source.key() : ""
                    if (key) { this._keymap.del(changeevent.source.key()) }

                    this.rebond(changeevent)
                    break

                default:

                    //andrew: testing out if this works
                    this.rebond(changeevent)
            }

            var def = this.definition()

            if (def && def.onchildchange) {
                def.onchildchange(changeevent)
            }

            var parent = this.parent()

            if (parent) {
                _.aliashelper.traitchange(parent, changeevent, null, true)
            }
        }


        , exportbehavior: _.behavior({
            todata: function (header) {
                if (this.hasself()) {
                    throw "self alert"
                }

                var data = {}
                var me = this
                this.foreach(function (item) {
                    data[item._uid] = item.todata(header)
                })
                return data
            }
        })

    }
})
