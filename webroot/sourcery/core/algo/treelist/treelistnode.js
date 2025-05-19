//*************************************************************************************************
// treelistnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("treelistnode", function (_) {
    _.define.object("treelistnode", function () {
        this._list = null;
        this._item = null;

        this._topnode = null;
        this._leftnode = null;
        this._rightnode = null;
        this._count = 0;

        //todo: if item is in another list, remove from other list first.
        this.construct = function (list, item) {
            if (!list || !item || item._indexof) { throw "error"; }
            this._list = list;

            this._item = item;
            this._item._indexof = this;

            //this._evolution = _.enum.evolution.create
        };

        this.parent = function () {
            return this._list._parent;
        };

        this.list = function () {
            return this._list;
        };

        this.item = function () {
            return this._item;
        };

        this.value = function () {
            return this._item.value();
        };

        this.name = function () {
            return this._item.name();
        };

        this.ishangingleft = function () {
            return (this._topnode && (this._topnode._leftnode == this));
        };

        this.ishangingright = function () {
            return (this._topnode && (this._topnode._rightnode == this));
        };

        //#   X             Y
        //#     Y   -->   X
        //#   Z             Z
        this.rotateleft = function () {
            var x = this;
            var y = x._rightnode;

            if (!y) { return this; }

            var z = y._leftnode;

            if (z) {
                z._topnode = x;
                x._rightnode = z;

                y._count -= z._count;

            } else {
                x._rightnode = null;
            }

            y._leftnode = x;
            x._count -= y._count;
            y._count += x._count;

            if (x._topnode) {
                if (x._topnode._leftnode == x) { //hangingleft
                    x._topnode._leftnode = y;
                } else {
                    x._topnode._rightnode = y;
                }
            } else {
                this._list._rootnode = y;
            }

            y._topnode = x._topnode;
            x._topnode = y;

            if (this.recalc) {
                z.recalc(false);
                x.recalc(false);
                y.recalc(false);
            }
        };

        //#     X             Y
        //#   y       -->       X
        //#     Z             Z
        this.rotateright = function () {
            var x = this;
            var y = x._leftnode;

            if (!y) { return this; }

            var z = y._rightnode;

            if (z) {
                z._topnode = x;
                x._leftnode = z;

                y._count -= z._count;

            } else {
                x._leftnode = null;
            }

            y._rightnode = x;
            x._count -= y._count;
            y._count += x._count;

            if (x._topnode) {
                if (x._topnode._rightnode == x) { //hangingright
                    x._topnode._rightnode = y;
                } else {
                    x._topnode._leftnode = y;
                }
            } else {
                this._list._rootnode = y;
            }

            y._topnode = x._topnode;
            x._topnode = y;

            if (this.recalc) {
                z.recalc(false);
                x.recalc(false);
                y.recalc(false);
            }
        };

        this.recalc = null;

        this.position = function () {
            var cursor = this;
            var result;

            if (cursor._leftnode) {
                result = cursor._leftnode._count + 1;
            } else {
                result = 1;
            }

            while (cursor._topnode) {
                var parent = cursor._topnode;

                if (parent._rightnode == cursor) {
                    if (parent._leftnode) {
                        result += parent._leftnode._count;
                    }
                    result += 1;
                }
                cursor = cursor._topnode;
            }
            return result;
        };

        this.level = function () {
            var cursor = this;
            var result = 0;
            
            while (cursor) {
                result++;
                cursor = cursor._topnode;
            }
            return result;
        };

        this.next = function (count) {
            var cursor = this;

            count = count || 1;

            while (cursor && (count > 0)) {
                if (cursor._rightnode) {

                    if (cursor._rightnode._count < count) {
                        count -= cursor._rightnode._count;

                        if (cursor.ishangingright()) {
                            cursor = cursor._topnode;
                            count -= 1;

                        } else {
                            cursor = null;
                        }

                    } else {
                        cursor = cursor._rightnode;

                        while (cursor._leftnode) {
                            cursor = cursor._leftnode;
                        }

                        count -= 1;
                    }

                } else {
                    if (cursor._topnode) {
                        while (cursor.ishangingright()) {
                            cursor = cursor._topnode;
                        }

                        if (cursor.ishangingleft()) {
                            cursor = cursor._topnode;
                            count -= 1;
                        } else {
                            cursor = null;
                        }
                    } else {
                        cursor = null;
                    }
                }
            }

            return cursor;
        };

        this.prev = function (count) {
            var cursor = this;

            count = count || 1;

            while (cursor && (count > 0)) {
                if (cursor._leftnode) {

                    if (cursor._leftnode._count < count) {
                        count -= cursor._leftnode._count;

                        if (cursor.ishangingleft()) {
                            cursor = cursor._topnode;
                            count -= 1;

                        } else {
                            cursor = null;
                        }

                    } else {

                        cursor = cursor._leftnode;

                        while (cursor._rightnode) {
                            cursor = cursor._rightnode;
                        }

                        count -= 1;
                    }

                } else {
                    if (cursor._topnode) {
                        while (cursor.ishangingleft()) {
                            cursor = cursor._topnode;
                        }

                        if (cursor.ishangingright()) {
                            cursor = cursor._topnode;
                            count -= 1;
                        } else {
                            cursor = null;
                        }
                    } else {
                        cursor = null;
                    }
                }
            }

            return cursor;
        };

        this.updatecount = function (count) {
            var cursor = this;

            while (cursor) {
                cursor._count += count;
                cursor = cursor._topnode;
            }
        };

        this.balance = function () {
            var top = this._topnode;

            var leftcount = this._leftnode ? this._leftnode._count : 0;
            var rightcount = this._rightnode ? this._rightnode._count : 0;

            if ((leftcount >> 1) > rightcount) {
                this.rotateright();

            } else if ((rightcount >> 1) > leftcount) {
                this.rotateleft();
            }

            if (top) {
                top.balance();
            }
        };

        // this.rebond = function () {
        //     if (this._list) {
        //         this._list.rebond(this);
        //     }
        // };

        this.debugdump = function() {
            _.debug(this.name() + " = " + this.value() + " (" + this.position() + ":" + this.level() + ")", (this._leftnode ? "L " + this._leftnode.name() + " (" + this._leftnode._count + ")" : "null"), (this._rightnode ? "R " + this._rightnode.name() + " (" + this._rightnode._count + ")" : "null"));
        };

        this.destroy = function () {
            // if (this._evolution == _.enum.evolution.destroy) { return null; }
            // this._evolution = _.enum.evolution.destroy;

            var nodelast = null;

            if (this._leftnode && this._rightnode) {
                var nodelast = this.next();
                nodelast._topnode.updatecount(-1);

                nodelast._leftnode = this._leftnode;
                this._leftnode._topnode = nodelast;

                if (this._rightnode != nodelast) {
                    if (nodelast._rightnode) {
                        nodelast._topnode._leftnode = nodelast._rightnode;
                        nodelast._rightnode._topnode = nodelast._topnode;
                    } else {
                        nodelast._topnode._leftnode = null;
                    }

                    nodelast._rightnode = this._rightnode;
                    this._rightnode._topnode = nodelast;
                }

                nodelast._count = this._count;

                if (!this._topnode) {
                    this._list._rootnode = nodelast;
                    nodelast._topnode = null;
                } else {
                    nodelast._topnode = this._topnode;

                    if (this.ishangingleft()) {
                        this._topnode._leftnode = nodelast;
                    } else {
                        this._topnode._rightnode = nodelast;
                    }
                }

            } else {
                if (this._topnode) {
                    this._topnode.updatecount(-1);
                }

                if (this._leftnode) {
                    var nodelast = this._leftnode;
                } else if (this._rightnode) {
                    var nodelast = this._rightnode;
                } else {
                    nodelast = null;
                }

                if (!this._topnode) {
                    this._list._rootnode = nodelast;
                    if (nodelast) {
                        nodelast._topnode = null;
                    }

                } else {
                    if (nodelast) {
                        nodelast._topnode = this._topnode;
                    }

                    if (this.ishangingleft()) {
                        this._topnode._leftnode = nodelast;
                    } else {
                        this._topnode._rightnode = nodelast;
                    }
                }
            }

            this._topnode = null;
            this._leftnode = null;
            this._rightnode = null;


            if (this._item) {
                if (this._item._indexof == this) {
                    this._item._indexof = null;
                }
                this._item = null;
            }

            return null;
        };
    })
})