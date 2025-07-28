//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("signaldata", function(_) {    
    _.define.object("signaldatanode", function (supermodel) {
        this.fnevent = null
        this._nextnode = null
        this._prevnode = null
        this._isroot = false

        this.construct = function(fnevent) {
            this.fnevent = fnevent
        }

        this.next = function() {
            return this._nextnode && this._nextnode._isroot ? null : this._nextnode
        }

        this.prev = function() {
            return this._prevnode && this._prevnode._isroot ? null : this._prevnode
        }

        this.destroy = function() {
            this._nextnode._prevnode = this._prevnode
            this._prevnode._nextnode = this._nextnode

            this._nextnode = null
            this._prevnode = null
        }
    })

    _.define.object("signaldatalist", function (supermodel) {
        this._parent = null
        this._name = null
        this._nextnode = null
        this._prevnode = null
        this._isroot = false

        this.construct = function(parent, name) {
            this._parent = parent
            this._name = name

            this._nextnode = this
            this._prevnode = this
        }

        this.add = function(fnevent) {
            var node = _.model.signaldatanode(fnevent)

            node._prevnode = this._prevnode
            node._nextnode = this._prevnode._nextnode
            node._prevnode._nextnode = node
            this._prevnode = node

            return node
        }

        this.foreach = function(fn) {
            var cursor = this._nextnode
            var nextcursor = null

            while (cursor && cursor != this) {
                nextcursor = cursor._nextnode
                fn(cursor)
                cursor = nextcursor
            }
            return this
        }

        this.destroy = function() {
            while (this._nextnode && this._nextnode != this) {
                this._nextnode.destroy()
            }
            this._nextnode = null
            this._prevnode = null
            this._parent = null
            this._name = null
        }
    })

    _.define.object("signaldata", function (supermodel) {
        this.object = null
        this.signals = null

        this.construct = function(object) {
            this.object = object
            this.signals = {}
        }

        this.addbasicsignal = function(name, fnevent) {
            this.signals[name] = fnevent
        }

        this.firebasicsignal = function(name, event) {
            var me = this

            var fnevent = this.signals[name]
            if (fnevent) {
                fnevent.call(me.object, event)
            }
        }

        this.addsignal = function(name, fnevent) {
            var list = this.signals[name]
            if (!list) {
                list = _.model.signaldatalist(this, name)
                this.signals[name] = list
            }
            list.add(fnevent)
        }

        this.firesignal = function(name, event) {
            var me = this

            var list = this.signals[name]
            if (list) {
                list.foreach(function(node) {
                    node.fnevent.call(me.object, event)
                })
            }
        }
    })
})