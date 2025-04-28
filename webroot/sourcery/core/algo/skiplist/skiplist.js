//*************************************************************************************************
// skiplist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplist", function(_) {    
    _.define.core.linkedlist("core.skiplist", function (supermodel) {
        this.__upsegment = null;
        this.__topsegment = null;

        this.__level = 1;
        this.__segmentsize = 8;
        this.__segmentlevel = 8;

        this.__issortlist = false;

        this.constructbehavior = _.behavior(function() {
            this.construct = function() {
                this.__nodenext = this;
                this.__nodeprev = this;

                this.__upsegment = _.make.core.skiplistsegment(this, this.__segmentlevel);
            };

            this.__makenode = function(value) {
                if (item instanceof _.make.skiplistnode) { return value; } 
                return _.make.skiplistnode(value);
            };

            this.issortlist = function(value) {
                if (value === undefined) { return this.__issortlist; }

                if (this.__issortlist != value) {
                    if (this.count() > 0) { throw "Cannot change list type after adding nodes"; }
                    this.__issortlist = value;
                }
                return this;
            };

            this.isorderlist = function() {
                return !this.__issortlist;
            };

            this.segmentsize = function(value) { 
                if (value === undefined) { return this.__segmentsize; }
                
                if (value >= 2) { 
                    this.__segmentsize = value;
                }
                return this;
            };

            this.segmentlevel = function(value) { 
                if (value === undefined) { return this.__segmentlevel; }

                if (value > this.__segmentlevel) { 
                    this.__segmentlevel = value;
                    _.make.skiplistsegment(this, value - 1);
                }
                return this;
            };
        });

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function () { return true; };
            this.base = function () { return this; };
            this.segmenttop = function () { return this.__topsegment; };

            this.level = function() { return 1; };

            this.segmentnext = function () {
                return this.__nodenext;
            };
            
            this.segmentprev = function () { 
                return this.__nodeprev;
            };

            this.segmentdown = function () { 
                return null;
            };

            this.segmentup = function () { 
                return this.__upsegment || undefined;
            };
        });


        this.modelbehavior = _.behavior(function() {
            this.add = function(value, orderindex) {
                var node = this.__makenode(value);
                var cursor;

                // For sorted lists
                if (this.issortlist()) {
                    // Find first and last nodes with matching value
                    var firstMatch = this.findfirstnode(value);
                    var lastMatch = this.findlastnode(value);
                    
                    if (!firstMatch) {
                        // No matching values - find correct position based on sort order
                        cursor = this.findlastnode(value, "<");
                        // If no smaller value found, insert at start
                        if (!cursor) {
                            cursor = this;
                        }
                    } else {
                        // We have matching values - handle orderindex
                        if (!orderindex || orderindex === 0) {
                            // Append after last matching value
                            cursor = lastMatch;
                        } else {
                            var matchCount = lastMatch.orderindex() - firstMatch.orderindex() + 1;
                            
                            if (orderindex < 0) {
                                // Convert negative index to positive (counting from end)
                                orderindex = matchCount + orderindex + 1;
                            }
                            
                            // Validate orderindex is within bounds of matching values
                            if (orderindex < 1 || orderindex > matchCount + 1) {
                                throw "Invalid orderindex: Would violate sort order";
                            }
                            
                            // Find the node at relative position within matching values
                            cursor = this.findrelativenode(firstMatch, orderindex - 1);
                        }
                    }
                } else {  // For ordered lists
                    if (orderindex) {
                        if (orderindex < 0) {
                            // Handle negative indices from end
                            var lastNode = this.nodelast();
                            cursor = this.findrelativenode(lastNode, orderindex);
                        } else {
                            cursor = this.nodebyindex(orderindex);
                        }
                    }
                }

                // If no position specified or found, append to end
                if (!cursor || cursor.isroot()) {
                    cursor = this.nodeprev();
                }

                // Assign the node and return it
                return node.assign(cursor, 1);
            };
        });

        this.searchbehavior = _.behavior(function() {
            this.nodebyindex = function(index) {
                var cursor = this.segmenttop();

                while (index) {
                    if (cursor.__childcount >= index) {
                        cursor = cursor.segmentdown();

                        if (cursor.level() == 1) {
                            if (cursor.isroot()) { cursor = cursor.segmentnext()}

                            while (!cursor.isroot() && (index > 1)) {
                                index -= 1;
                                cursor = cursor.segmentnext();
                            }
                            return cursor.isroot()? undefined : cursor;
                        }
                    } else {
                        index -= cursor.__childcount;
                        cursor = cursor.segmentnext();
                        if (cursor.isroot()) { return undefined; }
                    }
                }

                return undefined                
            };


            /*
                Finds an element in a skiplist based on a search value and optional relative index.
                
                This function searches for a node in the skiplist that matches the given search value.
                If a relative index is provided, it returns the node at that relative position from the first match.
                
                The search is optimized using the skiplist structure, allowing for efficient lookups.
                
                Parameters:
                - search: The value to search for (optional)
                - relativeindex: The relative position from the first matching node (optional)
                                 Positive values move forward, negative values move backward
                
                Returns: The found node or undefined if not found
                
                Note: If no search value is provided, the function returns undefined.
             */
            this.findnode = function(search, relativeindex) {
                if (search) {
                    if (relativeindex === undefined) { 
                        return this.findlastnode(search);
                    } else if (relativeindex < 0) {
                        var found = this.findlastnode(search);
                        return this.findrelativenode(found, relativeindex);
                    } else {
                        var found = this.findfirstnode(search);
                        return this.findrelativenode(found, relativeindex - 1);
                    }
                }
            };

            /*
                Finds the first element in the skiplist based on search criteria.
                
                Parameters:
                - search: The value to search for
                - option: Comparison operator ('==', '<=', '>=', '>', '<'). Defaults to '=='
                
                Returns: The found node or null if not found
            */
            this.findfirstnode = function(search, option) {
                if (!this.issortlist()) { throw "skiplist.findfirst: Is not a sortlist"; }
                if (search === undefined) { return null; }
                
                option = option || "==";
                var cursor = this.segmenttop();
                var found = null;

                // Traverse the skiplist
                while (cursor) {
                    if (cursor.valueinsegment(search, option)) {
                        if (cursor.level() == 1) {
                            found = cursor;
                            break;
                        }
                        cursor = cursor.segmentdown();
                    } else {
                        cursor = cursor.segmentnext();
                        if (cursor.isroot()) {
                            cursor = cursor.segmenttop();
                        }
                    }
                }

                return found;
            };

            /*
                Finds the last element in the skiplist based on search criteria.
                
                Parameters:
                - search: The value to search for
                - option: Comparison operator ('==', '<=', '>=', '>', '<'). Defaults to '=='
                
                Returns: The found node or null if not found
            */
            this.findlastnode = function(search, option) {
                if (!this.issortlist()) { throw "skiplist.findlast: Is not a sortlist"; }
                if (search === undefined) { return null; }
                
                option = option || "==";
                var cursor = this.segmenttop();
                var found = null;

                // Traverse the skiplist
                while (cursor) {
                    if (cursor.valueinsegment(search, option)) {
                        if (cursor.level() == 1) {
                            // For last match, continue searching until we find the last matching node
                            var next = cursor.segmentnext();
                            while (!next.isroot() && next.valueinsegment(search, option)) {
                                cursor = next;
                                next = next.segmentnext();
                            }
                            found = cursor;
                            break;
                        }
                        cursor = cursor.segmentdown();
                    } else {
                        cursor = cursor.segmentnext();
                        if (cursor.isroot()) {
                            cursor = cursor.segmenttop();
                        }
                    }
                }

                return found;
            };

            /*
                Finds a node at a relative position from a given segment node.
                Uses segment information for optimization when possible.
                Positive indices move right, negative indices move left.
                
                Parameters:
                - segmentnode: The starting segment node
                - relativeindex: The relative position from the segment node
                
                Returns: The found node or undefined if not found
            */
            this.findrelativenode = function(segmentnode, relativeindex) {
                if (!segmentnode) { return undefined; }
                if (relativeindex === 0) { return segmentnode; }

                var cursor = segmentnode;

                if (relativeindex === 0) { 
                    return undefined; 

                } else if (relativeindex > 0) {
                    while (relativeindex > 0) {
                        var segmentup = cursor.segmentup();

                        if (segmentup && (segmentup.__childcount < relativeindex)) {
                            cursor = segmentup;

                        } else if ((cursor.level() == 1) || (cursor.__childcount <= relativeindex)) {
                            relativeindex -= (cursor.level() == 1? 1: cursor.__childcount);
                            cursor = cursor.segmentnext();
                            if (cursor.isroot()) { return undefined; }

                        } else {
                            cursor = cursor.segmentdown();
                        }
                    }
                    return cursor.base()

                } else {
                    relativeindex = cursor.orderindex() + relativeindex
                    return this.nodebyindex(relativeindex);
                }
            };
        });           
      
        this.debugbehavior = _.behavior(function() {
            this.debugout = function () {
                var result = [];

                this.foreach(function(node) {
                    result.push(node.value());
                });
        
                return result;
            };

            this.debugvalidate = function() {
                var errors = [];
                var cursor = this.nodefirst();
                var count = 0;

                var errors = supermodel.debugvalidate.call(this) || [];

                while (cursor && cursor != this) {
                    var result = cursor.debugvalidate();

                    if (result) { errors.concat(result); }
                    cursor = cursor.nodenext();
                }

                var segment = this.__upsegment;
                var segmentlevel = 1;

                while (segment) {
                    var cursor = segment;
                    var count = 0;

                    do {
                        count += cursor.__childcount;
                        cursor = cursor.segmentnext();
                    } while (!cursor.isroot());

                    if (count != this.count()) { errors.push("Segment level " + segmentlevel + " childcount mismatch: " + count + ", expected: " + this.count()); }
                    segmentlevel += 1;
                    segment = segment.segmentup();
                }

                return errors.length? errors : undefined;
            };
        });            
    });
})
