//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("skiplist", function(_) {    
    _.define.linkedlist("skiplist", function (supermodel) {
        this._upsegment = null
        this._topsegment = null

        this._level = 1
        this._segmentsize = 7

        this._issortlist = false
        this._sortvaluename = null

        this._list

        this.constructbehavior = _.behavior(function() {
            this.construct = function(sortvaluename) {
                this._list = this

                this._nextnode = this
                this._prevnode = this

                this._sortvaluename = sortvaluename
                if (sortvaluename) { this._issortlist = true }

                this._upsegment = _.model.skiplistsegment(this)
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
                
                if (value > 2) { 
                    this._segmentsize = value
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
                return this._nextnode
            }

            this.segmentprev = function () { 
                return this._prevnode
            }

            this.segmentdown = function () { 
                return null
            }

            this.segmentup = function () { 
                return this._upsegment || null
            }

            this.segmentleftup = function() { return this.segmentup() }                
            this.segmentrightup = function() { return null }
        })


        this.modelbehavior = _.behavior(function() {
            this.add = function(value, orderindex) {
                var node = this._makenode(value)
                var value = node.sortvalue(this)
                var cursor

                if (!this.count()) {
                    return node.assign(this)
                }

                if (this.issortlist()) {
                    var firstMatch = this.findfirstnode(value)
                    var lastMatch = this.findlastnode(value)
                    
                    if (!firstMatch) {
                        cursor = this.findfirstnode(value, "<")
                        if (!cursor) { cursor = this }

                    } else {
                        if (!orderindex || orderindex === 0) {
                            cursor = lastMatch.segmentnext()
                        } else {
                            var matchCount = lastMatch.orderindex() - firstMatch.orderindex() + 1
                            
                            if (orderindex < 0) { orderindex = matchCount + orderindex + 1 }
                            
                            if (orderindex < 1) { 
                                orderindex = 1
                            } else if (orderindex > matchCount + 1) {
                                orderindex = matchCount + 1
                            }
                            
                            cursor = this.findrelativenode(firstMatch, orderindex - 1)
                        }
                    }
                } else { 
                    if (orderindex) {
                        if (orderindex < 0) {
                            var lastNode = this.lastnode()
                            cursor = this.findrelativenode(lastNode, orderindex)
                        } else {
                            cursor = this.nodebyindex(orderindex)
                        }
                    }
                }

                return node.assign(cursor || this)
            }
        })

        this.searchbehavior = _.behavior(function() {
                // The first element in the list has orderindex 1
                // When searching for an element the index or the relative index can have a positive or negative value.
                //     negative value: Search from the back. -1 points at the last element
                //     positive value: Search from the front. 1 points at the first element

            this.nodebyindex = function(index) {
                if (index <= 0) { index = this.count() + index }
                if (index > this.count()) { return null }

                var cursor = this.segmenttop()

                while (index) {
                    if (cursor.level() == 1) {
                        if (cursor.isroot()) { cursor = cursor.segmentnext()}

                        while (!cursor.isroot() && (index > 1)) {
                            index -= 1
                            cursor = cursor.segmentnext()
                        }
                        return cursor.isroot()? null : cursor

                    } else if (cursor._nodecount >= index) {
                        cursor = cursor.segmentdown()

                    } else {
                        index -= cursor._nodecount
                        cursor = cursor.segmentnext()
                        if (cursor.isroot()) { return null }
                    }
                }

                return null                
            }

            // this.findnode = function(search, relativeindex) {
            //     if (!this.issortlist()) { throw "skiplist.findnode: List is not a sortlist" }

            //     if (search) {
            //         if (relativeindex == null) { 
            //             return this.findlastnode(search)
            //         } else if (relativeindex < 0) {
            //             var found = this.findlastnode(search)
            //             return this.findrelativenode(found, relativeindex)
            //         } else {
            //             var found = this.findfirstnode(search)
            //             return this.findrelativenode(found, relativeindex - 1)
            //         }
            //     }
            // }

            this._segmenttraversenext = function(cursor, ismatch) {
                if (ismatch && (cursor.level() > 1)) {
                    cursor = cursor.segmentdown()
                    if ((cursor.level() == 1) && cursor.isroot()) { 
                        cursor = cursor.segmentnext()
                        return (cursor.isroot()? null: cursor)
                    }
                    return cursor

                } else {
                    cursor = cursor.segmentnext()
                    if (cursor.isroot()) { return null }
                    if (!ismatch) { cursor = cursor.segmenttop() }
                    return cursor
                }
                    
                return null
            }
            
            this.findfirstnode = function(search, compareoption) {
                return this.findnextnode(null, search, compareoption)
                // if (!this.issortlist()) { throw "skiplist.findfirstnode: List is not a sortlist" }
                // if (!this.count()) { return null }

                // var cursor = this.segmenttop()

                // if (search == null) { return null }
                // compareoption = compareoption || "=="

                // while (cursor) {
                //     if (cursor.valueinsegment(search, compareoption)) {
                //         if (cursor.level() == 1) { return cursor }
                //         cursor = this._segmenttraversenext(cursor, true)
                //     } else {
                //         cursor = this._segmenttraversenext(cursor, false)
                //     }
                // }
            }
            
            this.findnextnode = function(segmentnode, search, compareoption) {
                var cursor = segmentnode

                if (!this.issortlist()) { throw "skiplist.findnextnode: List is not a sortlist" }
                if (!this.count()) { return null }
                if (search === undefined) { return null }
                compareoption = compareoption || "=="

                if (!cursor || cursor.isroot()) { //Support for findfirstnode
                    cursor = this.segmenttop()
                } else {
                    cursor = cursor.segmentnext()
                    if (cursor.isroot()) { return null }
                }

                while (cursor) {
                    if (cursor.valueinsegment(search, compareoption)) {
                        if (cursor.level() == 1) { return cursor }
                        cursor = this._segmenttraversenext(cursor, true)
                    } else {
                        cursor = this._segmenttraversenext(cursor, false)
                    }
                }

                return null
            }

            this._segmenttraverseprev = function(cursor, ismatch) {
                if (ismatch && (cursor.level() > 1)) {
                    cursor = cursor.segmentdown()
                    if (cursor.level() == 1) { 
                        cursor = cursor.segmentprev() 
                        if (cursor.isroot()) { cursor = null }
                    }
                    return cursor
                } else {
                    cursor = cursor.segmentprev()
                    if (cursor.isroot()) { return null }
                    if (!ismatch) { cursor = cursor.segmenttop() }                    
                    return cursor
                }
                    
                return null
            }  

            this.findlastnode = function(search, compareoption) {
                if (!this.issortlist()) { throw "skiplist.findlastnode: List is not a sortlist" }
                return this.findprevnode(null, search, compareoption)                // var cursor = this.segmenttop()

                // if (search == null) { return null }                
                // compareoption = compareoption || "=="
                
                // while (cursor && cursor.level() > 1) {
                //     var peek = cursor.segmentprev()

                //     if (peek.valueinsegment(search, compareoption)) {
                //         cursor = this._segmenttraverseprev(cursor, true)
                //     } else {
                //         cursor = this._segmenttraverseprev(cursor, false)
                //     }
                // }

                // while (cursor) {
                //     if (cursor.valueinsegment(search, compareoption)) { return cursor }
                //     cursor = cursor.prevnode()
                // }

                // return cursor
            }
            
            this.findprevnode = function(segmentnode, search, compareoption) {
                var cursor = segmentnode

                if (!this.issortlist()) { throw "skiplist.findprevnode: List is not a sortlist" }
                if (!this.count()) { return null }
                
                if (search == null) { return null }
                compareoption = compareoption || "=="

                if (!cursor || cursor.isroot()) { //Support for findfirstnode
                    cursor = this.segmenttop()
                } else {
                    if (!(cursor instanceof _.model.skiplistnode)) { throw "skiplist.findprevnode: segmentnode should be a skiplistnode" }
                    cursor = cursor.segmentprev()
                    if (cursor.isroot()) { return null }
                }                

                while (cursor && cursor.level() > 1) {
                    var peek = cursor.segmentprev()

                    if (peek.valueinsegment(search, compareoption)) {
                        cursor = this._segmenttraverseprev(cursor, true)
                    } else {
                        cursor = this._segmenttraverseprev(cursor, false)
                    }
                }

                while (cursor) {
                    if (cursor.valueinsegment(search, compareoption)) { return cursor }
                    cursor = cursor.prevnode()
                }

                return cursor
            }            

            this.findrelativenode = function(segmentnode, relativeindex) {
                if (!segmentnode) { return null }
                if (relativeindex === 0) { return segmentnode }

                var cursor = segmentnode

                if (relativeindex > 0) {
                    while (relativeindex > 0) {
                        var segmentup = cursor.segmentup()

                        if (segmentup && (segmentup._nodecount < relativeindex)) {
                            cursor = segmentup

                        } else if ((cursor.level() == 1) || (cursor._nodecount <= relativeindex)) {
                            relativeindex -= (cursor.level() == 1? 1: cursor._nodecount)
                            cursor = cursor.segmentnext()
                            if (cursor.isroot()) { return null }

                        } else {
                            cursor = cursor.segmentdown()
                        }
                    }
                    return cursor.base()

                } else {
                    relativeindex = cursor.orderindex() + relativeindex
                    if (relativeindex <= 0) { return null }
                    return this.nodebyindex(relativeindex)
                }
            }
        })           
      
        this.debugbehavior = _.behavior(function() {
            this.debugout = function () {
                var result = "Root, segments ["                
                var cursor = this.segmentup()

                while (cursor) {
                    result += cursor._nodecount
                    cursor = cursor.segmentup()
                    if (cursor) { result += ", " }
                }
                result += "]\n"

                var result = "Items #" + this.count() + ": "
                var lastnode = this.lastnode()

                this.foreach(function(node) {
                    result += node.value()
                    if (node != lastnode) { result += ", " }
                })
                
                return result
            }

            this.debugvalidate = function() {
                var errors = []
                var cursor = this.firstnode()
                var count = 0

                var errors = supermodel.debugvalidate.call(this) || []

                while (cursor && cursor != this) {
                    var result = cursor.debugvalidate()

                    if (result) { errors = errors.concat(result) }
                    cursor = cursor.nextnode()
                }

                var segment = this._upsegment
                var segmentlevel = 1

                while (segment) {
                    var cursor = segment
                    var count = 0

                    do {
                        count += cursor._nodecount
                        cursor = cursor.segmentnext()
                    } while (!cursor.isroot())

                    if (count != this.count()) { errors.push("Segment level " + segmentlevel + " nodecount mismatch: " + count + ", expected: " + this.count()) }
                    segmentlevel += 1
                    segment = segment.segmentup()
                }

                return errors.length? errors : null
            }
        })            
    })
})
