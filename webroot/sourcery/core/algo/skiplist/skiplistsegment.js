//*************************************************************************************************
// skiplistsegmentlevel - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistsegment", function (_) {
    _.define.core.object("core.skiplistsegment", function (supermodel) {
        this.__base = null;
        this.__level = 0;
        this.__upsegment = null;
        this.__downsegment = null;

        this.__nextsegment = null;
        this.__prevsegment = null;

        this.__childcount = 0;

        this.constructbehavior = _.behavior(function() {
            this.construct = function(segmentdown, level) {
                if (!this.__downsegment) {
                    this.__level = segmentdown.__level + 1;
                    this.__downsegment = segmentdown;
                    this.__base = (segmentdown instanceof _.make.core.skiplistsegment ? segmentdown.__base : segmentdown);
                    this.__base.__topsegment = this;

                    if (this.isroot()) {
                        this.__nextsegment = this;
                        this.__prevsegment = this;
                    } else {
                        this.link();
                    }
                }

                if (level > 1) {
                    if (this.__upsegment) {
                        this.__upsegment.construct(this, level - 1);
                    } else {
                        this.__upsegment = _.make.core.skiplistsegment(this, level - 1);
                    }
                }                    
            };

            this.link = function() {
                this.__nextsegment = this.segmentnext();
                this.__prevsegment = this.segmentprev();

                this.__nextsegment.__prevsegment = this;
                this.__prevsegment.__nextsegment = this;

                if (this.__upsegment) { this.__upsegment.link(); }
            };

            this.unlink = function() {
                if (this.__upsegment) { this.__upsegment.unlink(); }
                this.__prevsegment.__nextsegment = this.__nextsegment;
                this.__nextsegment.__prevsegment = this.__prevsegment;
                this.__prevsegment = null;
                this.__nextsegment = null;
            };

            this.calcsegment = function(calcprevsegment, recursive) {
                var childcount = 0;

                var cursor = this.segmentdown();

                var segmentright = this.__nextsegment;
                var segmentend = segmentright.segmentdown();

                if (!cursor.isroot() && calcprevsegment){
                    this.segmentprev().calcsegment(false, false);
                }

                do {
                    if (cursor instanceof _.make.core.skiplistsegment) { 
                        childcount += cursor.__childcount;
                    } else if (cursor instanceof _.make.core.skiplistnode) {
                        childcount++;
                    }
                    cursor = cursor.segmentnext();
                } while (cursor != segmentend);

                this.__childcount = childcount;


                if (recursive) {
                    var segmentleftup = this.segmentleftup();

                    if (calcprevsegment) {
                        if (segmentleftup.isroot() || this.segmentprev().segmentleftup() == segmentleftup) {
                            calcprevsegment = false;
                        }
                    }

                    if (segmentleftup) {
                        segmentleftup.calcsegment(calcprevsegment, recursive);
                    }
                } 
            };
        });

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function () { return this.__base.isroot(); };
            this.base = function () { return this.__base; };
            this.segmenttop = function () { return this.__base.__topsegment; };
            this.level = function() { 
                var result = 0;
                var cursor = this;

                while (cursor) {
                    result++;
                    cursor = cursor.__downsegment;
                }
                return result;
            };

            this.segmentnext = function () {
                if (this.__nextsegment) { 
                    return this.__nextsegment; 
                } else {
                    return this.segmentdown().segmentrightup();
                }
            };
            
            this.segmentprev = function () { 
                if (this.__prevsegment) { 
                    return this.__prevsegment; 
                } else {
                    return this.segmentdown().segmentleftup();
                }
            };

            this.segmentdown = function () { 
                return this.__downsegment;
            };

            //todo: we can optimize by dual using __upsegment
            this.segmentleftup = function() {
                if (this.__upsegment) {  return this.__upsegment; }
                if (this.isroot()) { return null; }

                var cursor = this;

                while (cursor) {
                    if (cursor.__upsegment) { return cursor.__upsegment; }
                    cursor = cursor.__prevsegment;
                }
            };
            this.segmentrightup = function() {
                return this.segmentleftup().__nextsegment;
            };

            //todo: Split segment into 2 functions. One that returns the direct up segment, other that returns the segment group.
            this.segmentup = function () { 
                return this.__upsegment || undefined;
            };

            this.segmentroot = function() {
                return this.__base.__topsegment;
            };
        });

        this.searchbehavior = _.behavior(function() {
            this.orderindex = function() {
                var index = 0;
                var cursor = this;

                while (cursor) {
                    if (cursor.__segmentup) { cursor = cursor.segmenttop() }
                    cursor = cursor.__prevsegment;
                    index += cursor.__childcount;

                    if (cursor.isroot()) { break; }
                }
                return index;
            };

            this.valueinsegment = function(search) {
                var currentnode = this.__base
                var nextnode = this.segmentnext().__base
                if (nextnode.isroot()) { nextnode = nextnode.__prevnode }

                if (search < currentnode.value() || search > nextnode.value()) { return false }
                return true;
            }

            this.findnode = function(search, relativeindex) {
                var cursor = this.segmenttop()
                var found = null

                if (search) {
                    while (cursor) {
                        if (cursor.valueinsegment(search)) {
                            cursor = cursor.segmentdown();
                            while (cursor) {
                                if (cursor.value() == search) {
                                    found = cursor;
                                    break;
                                }
                                cursor = cursor.segmentnext();
                            }
                            break;
                        }
                        cursor = cursor.segmentnext();
                    }
                } else if (relativeindex) {
                    found = cursor
                }

                if (found && relativeindex) { 
                    found = found.nodebyindex(relativeindex) 
                    if (!found) { return null }
                    if (found.value() != search) { return null }
                }
                return found;
            }

            this.nodebyindex = function(index) {
                var cursor = this.segmenttop();

                while (index) {
                    if (cursor.__childcount >= index) {
                        cursor = cursor.segmentdown();

                        if (cursor instanceof _.make.core.skiplistnode) {
                            while (index > 1) {
                                index -= 1;
                                cursor = cursor.segmentnext();
                                if (cursor.isroot()) { return undefined; }
                            }
                            return cursor;
                        }
                    } else {
                        index -= cursor.__childcount;
                        cursor = cursor.segmentnext();
                        if (cursor.isroot()) { return undefined; }
                    }
                }

                return undefined
            }
        });

        this.debugbehavior = _.behavior(function() {
            this.debugout = function() {};
            this.debugvalidate = function() {
                var errors = (this.__segmentup ? this.__segmentup.debugvalidate() : []);

                if (!this.__nextsegment || this.__nextsegment.__prevsegment !== this) { errors.push("Next segment mismatch"); }
                if (!this.__prevsegment || this.__prevsegment.__nextsegment !== this) { errors.push("Prev segment mismatch"); }
                if (this.__downsegment.__upsegment !== this) { errors.push("Down segment mismatch"); }
                if (!this.__upsegment && this.__base.__topsegment !== this) { errors.push("Up segment mismatch"); } 
                return errors.length ? errors : undefined;
            };
        });
    });
});
