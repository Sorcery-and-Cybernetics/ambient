//*************************************************************************************************
// signaldata - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("signaldata", function(_) {    
    _.define.core.object("core.signaldatanode", function (supermodel) {
        return {
            fnevent: null

            , _nextnode: null
            , _prevnode: null
            , _isroot: false

            , initialize: function(fnevent) {
                this.fnevent = fnevent
            }

            , next: function() {
                return this._nextnode && this._nextnode._isroot ? null : this._nextnode
            }

            , prev: function() {
                return this._prevnode && this._prevnode._isroot ? null : this._prevnode
            }

            , destroy: function() {
                this._nextnode._prevnode = this._prevnode
                this._prevnode._nextnode = this._nextnode

                this._nextnode = null
                this._prevnode = null
            }
        }
    })

    _.define.core.object("core.signaldatalist", function (supermodel) {
        return {
            _parent: null
            , _name: null
            , _nextnode: null
            , _prevnode: null
            , _isroot: true

            , initialize: function(parent, name) {
                this._parent = parent
                this._name = name

                this._nextnode = this
                this._prevnode = this
            }

            , add: function(fnevent) {
                var node = _.make.core.signaldatanode(fnevent)

                node._prevnode = this._prevnode
                node._nextnode = this._prevnode._nextnode
                node._prevnode._nextnode = node
                this._prevnode = node

                return node
            }

            , foreach: function(fn) {
                var cursor = this._nextnode
                var nextcursor = null

                while (cursor && cursor != this) {
                    nextcursor = cursor._nextnode
                    fn(cursor)
                    cursor = nextcursor
                }
                return this
            }

            , destroy: function() {
                while (this._nextnode && this._nextnode != this) {
                    this._nextnode.destroy()
                }
                this._nextnode = null
                this._prevnode = null
                this._parent = null
                this._name = null
            }
        }
    })

    _.define.core.object("core.signaldata", function (supermodel) {
        return {
            object: null
            , signals: null

            , initialize: function(object) {
                this.object = object
                this.signals = {}
            }

            , addbasicsignal: function(name, fnevent) {
                this.signals[name] = fnevent
            }

            , firebasicsignal: function(name, event) {
                var fnevent = this.signals[name]
                if (fnevent) {
                    fnevent.call(this.object, event)
                }
            }

            , addsignal: function(name, fnevent) {
                var list = this.signals[name]
                if (!list) {
                    list = _.make.core.signaldatalist(this, name)
                    this.signals[name] = list
                }
                list.add(fnevent)
            }

            , firesignal: function(name, event) {
                var list = this.signals[name]
                if (list) {
                    list.foreach(function(node) {
                        node.fnevent.call(this.object, event)
                    })
                }
            }
        }
    })
})