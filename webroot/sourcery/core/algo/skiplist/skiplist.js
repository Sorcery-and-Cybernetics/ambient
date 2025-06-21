//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("skiplist", function(_) {    
    _.define.linkedlist("skiplist", function (supermodel) {
        this._upsegment = undefined
        this._topsegment = undefined

        this._level = 1
        this._segmentsize = 7

        this._issortlist = false
        this._sortvaluename = undefined

        this._list

        this.constructbehavior = _.behavior(function() {
            this.construct = function(sortvaluename) {
                this._list = this

                this._nodenext = this
                this._nodeprev = this

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
                            var lastNode = this.nodelast()
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
                if (index > this.count()) { return undefined }

                var cursor = this.segmenttop()

                while (index) {
                    if (cursor.level() == 1) {
                        if (cursor.isroot()) { cursor = cursor.segmentnext()}

                        while (!cursor.isroot() && (index > 1)) {
                            index -= 1
                            cursor = cursor.segmentnext()
                        }
                        return cursor.isroot()? undefined : cursor

                    } else if (cursor._nodecount >= index) {
                        cursor = cursor.segmentdown()

                    } else {
                        index -= cursor._nodecount
                        cursor = cursor.segmentnext()
                        if (cursor.isroot()) { return undefined }
                    }
                }

                return undefined                
            }

            // this.findnode = function(search, relativeindex) {
            //     if (!this.issortlist()) { throw "skiplist.findnode: List is not a sortlist" }

            //     if (search) {
            //         if (relativeindex === undefined) { 
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
                        return (cursor.isroot()? undefined: cursor)
                    }
                    return cursor

                } else {
                    cursor = cursor.segmentnext()
                    if (cursor.isroot()) { return undefined }
                    if (!ismatch) { cursor = cursor.segmenttop() }
                    return cursor
                }
                    
                return undefined
            }
            
            this.findfirstnode = function(search, compareoption) {
                return this.findnextnode(null, search, compareoption)
                // if (!this.issortlist()) { throw "skiplist.findfirstnode: List is not a sortlist" }
                // if (!this.count()) { return undefined }

                // var cursor = this.segmenttop()

                // if (search === undefined) { return undefined }
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
                if (!this.count()) { return undefined }
                if (search === undefined) { return undefined }
                compareoption = compareoption || "=="

                if (!cursor || cursor.isroot()) { //Support for findfirstnode
                    cursor = this.segmenttop()
                } else {
                    cursor = cursor.segmentnext()
                    if (cursor.isroot()) { return undefined }
                }

                while (cursor) {
                    if (cursor.valueinsegment(search, compareoption)) {
                        if (cursor.level() == 1) { return cursor }
                        cursor = this._segmenttraversenext(cursor, true)
                    } else {
                        cursor = this._segmenttraversenext(cursor, false)
                    }
                }

                return undefined
            }

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

            this.findlastnode = function(search, compareoption) {
                if (!this.issortlist()) { throw "skiplist.findlastnode: List is not a sortlist" }
                return this.findprevnode(null, search, compareoption)                // var cursor = this.segmenttop()

                // if (search === undefined) { return undefined }                
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
                //     cursor = cursor.nodeprev()
                // }

                // return cursor
            }
            
            this.findprevnode = function(segmentnode, search, compareoption) {
                var cursor = segmentnode

                if (!this.issortlist()) { throw "skiplist.findprevnode: List is not a sortlist" }
                if (!this.count()) { return undefined }
                
                if (search === undefined) { return undefined }
                compareoption = compareoption || "=="

                if (!cursor || cursor.isroot()) { //Support for findfirstnode
                    cursor = this.segmenttop()
                } else {
                    if (!(cursor instanceof _.model.skiplistnode)) { throw "skiplist.findprevnode: segmentnode should be a skiplistnode" }
                    cursor = cursor.segmentprev()
                    if (cursor.isroot()) { return undefined }
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
                    cursor = cursor.nodeprev()
                }

                return cursor
            }            

            this.findrelativenode = function(segmentnode, relativeindex) {
                if (!segmentnode) { return undefined }
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
                            if (cursor.isroot()) { return undefined }

                        } else {
                            cursor = cursor.segmentdown()
                        }
                    }
                    return cursor.base()

                } else {
                    relativeindex = cursor.orderindex() + relativeindex
                    if (relativeindex <= 0) { return undefined }
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
                var lastnode = this.nodelast()

                this.foreach(function(node) {
                    result += node.value()
                    if (node != lastnode) { result += ", " }
                })
                
                return result
            }

            this.debugvalidate = function() {
                var errors = []
                var cursor = this.nodefirst()
                var count = 0

                var errors = supermodel.debugvalidate.call(this) || []

                while (cursor && cursor != this) {
                    var result = cursor.debugvalidate()

                    if (result) { errors = errors.concat(result) }
                    cursor = cursor.nodenext()
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

                return errors.length? errors : undefined
            }
        })            
    })
})
