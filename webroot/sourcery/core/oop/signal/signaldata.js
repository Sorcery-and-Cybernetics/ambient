//*************************************************************************************************
// signaldata - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("signaldata", function(_) {    
    _.define.object("signaldatanode", function (supermodel) {
        this.fnevent = null;
        this._nodenext = null;
        this._nodeprev = null;
        this._isroot = false;

        this.construct = function(fnevent) {
            this.fnevent = fnevent;
        };

        this.next = function() {
            return this._nodenext && this._nodenext._isroot ? null : this._nodenext;
        };

        this.prev = function() {
            return this._nodeprev && this._nodeprev._isroot ? null : this._nodeprev;
        };

        this.destroy = function() {
            this._nodenext._nodeprev = this._nodeprev;
            this._nodeprev._nodenext = this._nodenext;

            this._nodenext = null;
            this._nodeprev = null;
        };
    })

    _.define.object("signaldatalist", function (supermodel) {
        this._parent = null;
        this._name = null;
        this._nodenext = null;
        this._nodeprev = null;
        this._isroot = true;

        this.construct = function(parent, name) {
            this._parent = parent;
            this._name = name;

            this._nodenext = this;
            this._nodeprev = this;
        };

        this.add = function(fnevent) {
            var node = _.model.signaldatanode(fnevent);

            node._nodeprev = this._nodeprev;
            node._nodenext = this._nodeprev._nodenext;
            node._nodeprev._nodenext = node;
            this._nodeprev = node;

            return node;
        };

        this.foreach = function(fn) {
            var cursor = this._nodenext;
            var nextcursor = null;

            while (cursor && cursor != this) {
                nextcursor = cursor._nodenext;
                fn(cursor);
                cursor = nextcursor;
            }
            return this;
        };

        this.destroy = function() {
            while (this._nodenext && this._nodenext != this) {
                this._nodenext.destroy();
            }
            this._nodenext = null;
            this._nodeprev = null;
            this._parent = null;
            this._name = null;
        };
    })

    _.define.object("signaldata", function (supermodel) {
        this.object = null;
        this.signals = null;

        this.construct = function(object) {
            this.object = object;
            this.signals = {};
        };

        this.addbasicsignal = function(name, fnevent) {
            this.signals[name] = fnevent;
        };

        this.firebasicsignal = function(name, event) {
            var fnevent = this.signals[name];
            if (fnevent) {
                fnevent.call(this.object, event);
            }
        };

        this.addsignal = function(name, fnevent) {
            var list = this.signals[name];
            if (!list) {
                list = _.model.signaldatalist(this, name);
                this.signals[name] = list;
            }
            list.add(fnevent);
        };

        this.firesignal = function(name, event) {
            var list = this.signals[name];
            if (list) {
                list.foreach(function(node) {
                    node.fnevent.call(this.object, event);
                });
            }
        };
    })
})