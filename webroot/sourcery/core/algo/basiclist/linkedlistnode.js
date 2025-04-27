//*************************************************************************************************
// listnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("linkedlistnode", function (_) {

    _.define.core.object("core.linkedlistnode", function (supermodel) {
        this.__nodenext = null;
        this.__nodeprev = null;

        this.__list = null;
        this._value = null;

        this.constructbehavior = _.behavior(function() {
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
                        cursor = cursor.__nodeprev;
                        if (cursor == list) { break; }
                        index += 1;

                    } else {
                        if (cursor.__nodenext == list) { break; }
                        cursor = cursor.__nodenext;
                        index -= 1;
                    }
                }

                this.__list = list;
                list.__count += 1;

                this.__nodeprev = cursor;
                this.__nodenext = cursor.__nodenext;

                this.__nodeprev.__nodenext = this;
                this.__nodenext.__nodeprev = this;

                return this;
            };

            this.unlink = function() {
                if (this.list()) {
                    this.__list.__count -= 1;
                }
    
                if (this.__nodenext) { this.__nodenext.__nodeprev = this.__nodeprev; }
                if (this.__nodeprev) { this.__nodeprev.__nodenext = this.__nodenext; }
    
                this.__list = null;
                this.__nodenext = null;
                this.__nodeprev = null;
            };
    
            this.calcsegment = function() {
                
            };  
            
            this.destroy = function () {
                if (this.__list) { this.unlink(); }
                return null;
            };            
        });

        this.navigationbehavior = _.behavior(function() {
            this.nodenext = function () {
                return !this.__nodenext || (this.__nodenext == this.__list ? null : this.__nodenext);
            };

            this.nodeprev = function () {
                return !this.__nodeprev || (this.__nodeprev == this.__list ? null : this.__nodeprev);
            };
        });

    });

});
