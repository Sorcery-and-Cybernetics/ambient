//*************************************************************************************************
// signaldata - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("signaldata", function(_) {    
    _.define.object("signaldatanode", function (supermodel) {
        this.fnevent = undefined
        this._nodenext = undefined
        this._nodeprev = undefined
        this._isroot = false

        this.construct = function(fnevent) {
            this.fnevent = fnevent
        }

        this.next = function() {
            return this._nodenext && this._nodenext._isroot ? undefined : this._nodenext
        }

        this.prev = function() {
            return this._nodeprev && this._nodeprev._isroot ? undefined : this._nodeprev
        }

        this.destroy = function() {
            this._nodenext._nodeprev = this._nodeprev
            this._nodeprev._nodenext = this._nodenext

            this._nodenext = undefined
            this._nodeprev = undefined
        }
    })

    _.define.object("signaldatalist", function (supermodel) {
        this._parent = undefined
        this._name = undefined
        this._nodenext = undefined
        this._nodeprev = undefined
        this._isroot = false

        this.construct = function(parent, name) {
            this._parent = parent
            this._name = name

            this._nodenext = this
            this._nodeprev = this
        }

        this.add = function(fnevent) {
            var node = _.model.signaldatanode(fnevent)

            node._nodeprev = this._nodeprev
            node._nodenext = this._nodeprev._nodenext
            node._nodeprev._nodenext = node
            this._nodeprev = node

            return node
        }

        this.foreach = function(fn) {
            var cursor = this._nodenext
            var nextcursor = undefined

            while (cursor && cursor != this) {
                nextcursor = cursor._nodenext
                fn(cursor)
                cursor = nextcursor
            }
            return this
        }

        this.destroy = function() {
            while (this._nodenext && this._nodenext != this) {
                this._nodenext.destroy()
            }
            this._nodenext = undefined
            this._nodeprev = undefined
            this._parent = undefined
            this._name = undefined
        }
    })

    _.define.object("signaldata", function (supermodel) {
        this.object = undefined
        this.signals = undefined

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