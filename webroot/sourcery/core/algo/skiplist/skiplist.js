//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("skiplist", function(_) {    
    _.define.linkedlist("skiplist", function (supermodel) {
        this._upsegment = undefined
        this._topsegment = undefined

        this._level = 1
        this._segmentsize = 8
        this._segmentlevel = 8

        this._issortlist = false
        this._sortvaluename = undefined

        this.constructbehavior = _.behavior(function() {
            this.construct = function(sortvaluename) {
                this._nodenext = this
                this._nodeprev = this

                this._sortvaluename = sortvaluename
                if (sortvaluename) { this._issortlist = true }

                this._upsegment = _.model.skiplistsegment(this, this._segmentlevel)
            }

            this.sortvaluename = function(value) {
                if (value === undefined) { return this._sortvaluename }

                if (this._sortvaluename != value) {
                    if (this.count() > 0) { throw "Cannot change list type after adding nodes" }
                    this._sortvaluename = value
                }
                return this
            }

            this._makenode = function(value) {
                if (value instanceof _.model.skiplistnode) { return value } 
                return _.model.skiplistnode(value)
            }

            this.issortlist = function(value) {
                if (value === undefined) { return this._issortlist }

                if (this._issortlist != value) {
                    if (this.count() > 0) { throw "Cannot change list type after adding nodes" }
                    this._issortlist = value
                }
                return this
            }

            this.isorderlist = function() {
                return !this._issortlist
            }

            this.segmentsize = function(value) { 
                if (value === undefined) { return this._segmentsize }
                
                if (value >= 2) { 
                    this._segmentsize = value
                }
                return this
            }

            this.segmentlevel = function(value) { 
                if (value === undefined) { return this._segmentlevel }

                if (value > this._segmentlevel) { 
                    this._segmentlevel = value
                    _.model.skiplistsegment(this, value - 1)
                }
                return this
            }
        })

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function () { return true }
            this.base = function () { return this }
            this.segmenttop = function () { return this._topsegment }

            this.level = function() { return 1 }

            this.segmentnext = function () {
                return this._nodenext
            }

            this.segmentprev = function () { 
                return this._nodeprev
            }

            this.segmentdown = function () { 
                return undefined
            }

            this.segmentup = function () { 
                return this._upsegment || undefined
            }

            this.segmentleftup = function() { return this.segmentup() }                
            this.segmentrightup = function() { return undefined }
        })


        this.modelbehavior = _.behavior(function() {
            this.add = function(value, orderindex) {
                var node = this._makenode(value)
                var value = node.sortvalue(this)
                var cursor;

                if (!this.count()) {
                    return node.assign(this)
                }

                // For sorted lists
                if (this.issortlist()) {
                    // Find first and last nodes with matching value
                    var firstMatch = this.findfirstnode(value)
                    var lastMatch = this.findlastnode(value)
                    
                    if (!firstMatch) {
                        // No matching values - find correct position based on sort order
                        cursor = this.findfirstnode(value, "<")
                        // If no smaller value found, insert at start
                        if (!cursor) {
                            cursor = this
                        }
                    } else {
                        // We have matching values - handle orderindex
                        if (!orderindex || orderindex === 0) {
                            // Append after last matching value
                            cursor = lastMatch.segmentnext()
                        } else {
                            var matchCount = lastMatch.orderindex() - firstMatch.orderindex() + 1
                            
                            if (orderindex < 0) {
                                // Convert negative index to positive (counting from end)
                                orderindex = matchCount + orderindex + 1
                            }
                            
                            // Validate orderindex is within bounds of matching values
                            if (orderindex < 1) { 
                                orderindex = 1
                            } else if (orderindex > matchCount + 1) {
                                orderindex = matchCount + 1
                            }
                            
                            // Find the node at relative position within matching values
                            cursor = this.findrelativenode(firstMatch, orderindex - 1)
                        }
                    }
                } else {  // For ordered lists
                    if (orderindex) {
                        if (orderindex < 0) {
                            // Handle negative indices from end
                            var lastNode = this.nodelast()
                            cursor = this.findrelativenode(lastNode, orderindex)
                        } else {
                            cursor = this.nodebyindex(orderindex)
                        }
                    }
                }

                return node.assign(cursor || this)

                // If no position specified or found, append to end
                // if (!cursor || cursor.isroot()) {
                //     return node.assign(cursor);
                // } else {
                //     return node.assign(cursor, 1);    
                // }
            }
        })

        this.searchbehavior = _.behavior(function() {

            this.nodebyindex = function(index) {
                var cursor = this.segmenttop();

                while (index) {
                    if (cursor._childcount >= index) {
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
                        index -= cursor._childcount;
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
                Finds elements in the skiplist based on search criteria.
                
                Parameters:
                - search: The value to search for
                - option: Comparison operator ('==', '<=', '>=', '>', '<'). Defaults to '=='
                
                Returns: The found node or undefined if not found
            */
            this._segmenttraversenext = function(cursor, ismatch) {
                if (ismatch && (cursor.level() > 1)) {
                    cursor = cursor.segmentdown();
                    if ((cursor.level() == 1) && cursor.isroot()) { cursor = cursor.segmentnext(); return (cursor.isroot()? undefined: cursor) }
                    return cursor
                } else {
                    cursor = cursor.segmentnext();
                    if (cursor.isroot()) { return undefined; }
                    if (!ismatch) { cursor = cursor.segmenttop() }
                    return cursor
                }
                    
                return undefined
            }
            
            this.findfirstnode = function(search, option) {
                if (!this.issortlist()) { throw "skiplistcursor.findfirst: List is not a sortlist"; }
                if (!this.count()) { return undefined; }

                var cursor = this.segmenttop();

                if (search === undefined) { return undefined; }
                option = option || "==";

                while (cursor) {
                    if (cursor.valueinsegment(search, option)) {
                        if (cursor.level() == 1) { return cursor; }
                        cursor = this._segmenttraversenext(cursor, true);
                    } else {
                        cursor = this._segmenttraversenext(cursor, false);
                    }
                }
            }            

            /*
                Finds elements in the skiplist based on search criteria.
                
                Parameters:
                - search: The value to search for
                - option: Comparison operator ('==', '<=', '>=', '>', '<'). Defaults to '=='
                
                Returns: The found node or undefined if not found
            */
            this._segmenttraverseprev = function(cursor, ismatch) {
                if (ismatch && (cursor.level() > 1)) {
                    cursor = cursor.segmentdown()
                    if (cursor.level() == 1) { 
                        cursor = cursor.segmentprev() 
                        if (cursor.isroot()) { cursor = undefined }
                    }
                    return cursor
                } else {
                    cursor = cursor.segmentprev()
                    if (cursor.isroot()) { return undefined }
                    if (!ismatch) { cursor = cursor.segmenttop() }                    
                    return cursor
                }
                    
                return undefined
            }  

            this.findlastnode = function(search, option) {
                if (!this.issortlist()) { throw "skiplistcursor.findlast: List is not a sortlist" }
                if (!this.count()) { return undefined }

                var cursor = this.segmenttop()

                if (search === undefined) { return undefined }                
                option = option || "=="
                
                while (cursor && cursor.level() > 1) {
                    var peek = cursor.segmentprev()

                    // if (cursor.level() == 2) {
                    //     var x = 10
                    // }

                    if (peek.valueinsegment(search, option)) {
                        cursor = this._segmenttraverseprev(cursor, true)
                    } else {
                        cursor = this._segmenttraverseprev(cursor, false)
                    }
                }

                while (cursor) {
                    if (cursor.valueinsegment(search, option)) { return cursor }
                    cursor = cursor.nodeprev()
                }

                return cursor
            }           


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

                        if (segmentup && (segmentup._childcount < relativeindex)) {
                            cursor = segmentup;

                        } else if ((cursor.level() == 1) || (cursor._childcount <= relativeindex)) {
                            relativeindex -= (cursor.level() == 1? 1: cursor._childcount);
                            cursor = cursor.segmentnext();
                            if (cursor.isroot()) { return undefined; }

                        } else {
                            cursor = cursor.segmentdown();
                        }
                    }
                    return cursor.base()

                } else {
                    relativeindex = cursor.orderindex() + relativeindex
                    if (relativeindex < 0) { return undefined; }
                    return this.nodebyindex(relativeindex);
                }
            };
        });           
      
        this.debugbehavior = _.behavior(function() {
            this.debugout = function () {
                var result = "Root, segments ["                
                var cursor = this.segmentup()

                while (cursor) {
                    result += cursor._childcount
                    cursor = cursor.segmentup()
                    if (cursor) { result += ", " }
                }
                result += "]\n"

                var result = "Items #" + this.count() + ": "
                var lastnode = this.nodelast()

                this.foreach(function(node) {
                    result += node.value()
                    if (node != lastnode) { result += ", " }
                });
                
                return result
            };

            this.debugvalidate = function() {
                var errors = []
                var cursor = this.nodefirst()
                var count = 0

                var errors = supermodel.debugvalidate.call(this) || []

                while (cursor && cursor != this) {
                    var result = cursor.debugvalidate()

                    if (result) { errors.concat(result) }
                    cursor = cursor.nodenext()
                }

                var segment = this._upsegment
                var segmentlevel = 1

                while (segment) {
                    var cursor = segment
                    var count = 0

                    do {
                        count += cursor._childcount
                        cursor = cursor.segmentnext()
                    } while (!cursor.isroot())

                    if (count != this.count()) { errors.push("Segment level " + segmentlevel + " childcount mismatch: " + count + ", expected: " + this.count()) }
                    segmentlevel += 1
                    segment = segment.segmentup()
                }

                return errors.length? errors : undefined
            }
        })            
    })
})
