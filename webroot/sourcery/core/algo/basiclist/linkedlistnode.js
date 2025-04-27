//*************************************************************************************************
// listnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("linkedlistnode", function (_) {

    _.define.core.object("core.linkedlistnode", function (supermodel) {
        this.__nextnode = null;
        this.__prevnode = null;

        this.__list = null;
        this._value = null;

        this.construct = function(value) {
            this._value = value;
        };

        this.parent = function () {
            return this.__list._parent;
        };

        this.list = function () {
            return this.__list;
        };

        this.isroot = function() { return false; };

        this.value = function(value) {
            if (value === undefined) { return this._value; }

            if (value != value) {
                this._value = value;
            }
            return this;
        };

        this.assign = function(cursor, index) {
            if (!cursor) { throw "Error: linkedlistnode.insertmebefore. Cursor is null"; }
            if (cursor == this) { return this; }
            if (this.__list) { this.unlink(); }

            var list = (cursor instanceof _.make.core.linkedlist ? cursor : cursor.__list);

            if (index > 0) { index -= 1; }

            while (index) {
                if (index < 0) {
                    cursor = cursor.__prevnode;
                    if (cursor == list) { break; }
                    index += 1;

                } else {
                    if (cursor.__nextnode == list) { break; }
                    cursor = cursor.__nextnode;
                    index -= 1;
                }
            }

            this.__list = list;
            list.__count += 1;

            this.__prevnode = cursor;
            this.__nextnode = cursor.__nextnode;

            this.__prevnode.__nextnode = this;
            this.__nextnode.__prevnode = this;

            return this;
        };

        this.nextnode = function () {
            return !this.__nextnode || (this.__nextnode == this.__list ? null : this.__nextnode);
        };

        this.prevnode = function () {
            return !this.__prevnode || (this.__prevnode == this.__list ? null : this.__prevnode);
        };

        this.unlink = function() {
            if (this.list()) {
                this.__list.__count -= 1;
            }

            if (this.__nextnode) { this.__nextnode.__prevnode = this.__prevnode; }
            if (this.__prevnode) { this.__prevnode.__nextnode = this.__nextnode; }

            this.__list = null;
            this.__nextnode = null;
            this.__prevnode = null;
        };

        this.calcsegment = function() {
            
        };

        this.destroy = function () {
            if (this.__list) { this.unlink(); }
            return null;
        };
    });

});
