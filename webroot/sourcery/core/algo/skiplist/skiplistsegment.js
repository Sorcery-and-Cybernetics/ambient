//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("skiplistsegment", function (_) {
    var segmentvaluecompare = function(searchvalue, matchvaluefloor, matchvalueceil, option) {
        if (!matchvalueceil) { matchvalueceil = matchvaluefloor }

        switch(option) {
            case "<=":
                return searchvalue <= matchvalueceil
            case ">=":
                return searchvalue >= matchvaluefloor
            case ">":
                return searchvalue > matchvaluefloor
            case "<":
                return searchvalue < matchvalueceil
            default: // "==" or undefined
                return searchvalue >= matchvaluefloor && searchvalue <= matchvalueceil
        }
    }

    _.define.object("skiplistsegment", function () {
        this._base = undefined
        this._level = 0
        this._upsegment = undefined
        this._downsegment = undefined

        this._nextsegment = undefined
        this._prevsegment = undefined

        this._nodecount = 0
        this._childcount = 0

        this.constructbehavior = _.behavior(function() {
            this.construct = function(segmentdown, level) {
                if (!this._downsegment) {
                    this._level = segmentdown._level + 1
                    this._downsegment = segmentdown
                    this._base = (segmentdown instanceof _.model.skiplistsegment ? segmentdown._base : segmentdown)
                    this._base._topsegment = this

                    if (this.isroot()) {
                        this._nextsegment = this
                        this._prevsegment = this
                    } else {
                        this.link()
                    }
                }

                if (level > 1) {
                    if (this._upsegment) {
                        this._upsegment.construct(this, level - 1)
                    } else {
                        this._upsegment = _.model.skiplistsegment(this, level - 1)
                    }
                }                    
            }

            this.link = function() {
                this._nextsegment = this.segmentnext()
                this._prevsegment = this.segmentprev()

                this._nextsegment._prevsegment = this
                this._prevsegment._nextsegment = this

                if (this._upsegment) { this._upsegment.link() }
            }

            this.unlink = function() {
                if (this._upsegment) { 
                    this._upsegment.unlink() 
                }
                this._base._topsegment = this._downsegment
                
                if (!this.isroot()) {
                    var prevsegment = this._prevsegment
                }

                this._prevsegment._nextsegment = this._nextsegment
                this._nextsegment._prevsegment = this._prevsegment
                this._downsegment._upsegment = undefined
                this._prevsegment = undefined
                this._nextsegment = undefined
                this._downsegment = undefined
                this._base = undefined

                if (prevsegment) { prevsegment.calcsegment(false, true) }
            }
        })

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function () { return this._base.isroot() }
            this.base = function () { return this._base }
            this.segmenttop = function () { return this._base._topsegment }

            this.level = function() { 
                return this._level
                
                // var result = 0
                // var cursor = this

                // while (cursor) {
                //     result++
                //     cursor = cursor._downsegment
                // }
                // return result
            }

            this.segmentnext = function () {
                if (this._nextsegment) { 
                    return this._nextsegment 
                } else {
                    return this.segmentdown().segmentrightup()
                }
            }
            
            this.segmentprev = function () { 
                if (this._prevsegment) { 
                    return this._prevsegment 
                } else {
                    return this.segmentdown().segmentleftup()
                }
            }

            this.segmentdown = function () { 
                return this._downsegment
            }

            this.segmentleftup = function() {
                if (this._upsegment) {  return this._upsegment }
                if (this.isroot()) { return undefined }

                var cursor = this

                while (cursor) {
                    if (cursor._upsegment) { return cursor._upsegment }
                    cursor = cursor._prevsegment
                }
            }
            this.segmentrightup = function() {
                return this.segmentleftup()._nextsegment
            }

            this.segmentup = function () { 
                return this._upsegment || undefined
            }

            this.segmentroot = function() {
                return this._base._topsegment
            }
        })

        this.modelbehavior = _.behavior(function() {
            this.orderindex = function() {
                var index = 0
                var cursor = this

                while (cursor) {
                    if (cursor._segmentup) { cursor = cursor.segmenttop() }
                    cursor = cursor._prevsegment
                    index += cursor._nodecount

                    if (cursor.isroot()) { break }
                }
                return index
            }  
            
            this.calcsegment = function(calcprevsegment, recursive) {
                var nodecount = 0
                var childcount = 0

                var cursor = this.segmentdown()

                var segmentright = this._nextsegment
                var segmentend = segmentright.segmentdown()

                if (!cursor.isroot() && calcprevsegment){
                    this.segmentprev().calcsegment(false, false)
                }

                do {
                    if (cursor instanceof _.model.skiplistsegment) { 
                        nodecount += cursor._nodecount
                        if (!cursor.isroot()) { childcount++ }

                    } else if (!cursor.isroot()) {
                        nodecount++
                        childcount++
                    }

                    cursor = cursor.segmentnext()
                } while (cursor != segmentend)

                this._nodecount = nodecount
                this._childcount = childcount

                if (recursive) {
                    var segmentleftup = this.segmentleftup()

                    if (segmentleftup) {
                        if (segmentleftup.isroot() || this.segmentprev().segmentleftup() == segmentleftup) {
                            calcprevsegment = false
                        }

                        segmentleftup.calcsegment(calcprevsegment, recursive)
                    }
                }

                var maxsize = this._base._list._segmentsize

                if (this._childcount > maxsize) { 
                    var middlechild = this.findmiddlechild()
                    if (middlechild._upsegment) { throw "Error" }

                    newsegment = _.model.skiplistsegment(middlechild)
                    middlechild._upsegment = newsegment
                    newsegment.link()
                    newsegment.calcsegment(true, false)

                    this.calcsegment(false, false)

                    if (this.isroot()) { 
                        if (!this._upsegment) {
                            var newrootsegment = _.model.skiplistsegment(this)
                            this._upsegment = newrootsegment
                            this._upsegment.calcsegment()
                        }
                    }                    
                }  else if (!this._upsegment) {
                     if (this.isroot()) {
                         if ((this._level > 2) && (this._nodecount == 0)) { this.unlink() }

                      } else if ((this._childcount * 2) < maxsize) {
                          this.unlink()
                     }
                }

                return this
            }   
           
            this.findmiddlechild = function() {
                if (this._childcount < 3) { return undefined } 

                var index = this._childcount 
                var cursor = this.segmentdown()

                while (index > 1) { 
                    cursor = cursor.segmentnext()
                    index -= 2 
                }

                return cursor
            }            
        })

        this.searchbehavior = _.behavior(function() {
            this.segmentfloor = function() {
                if (this.isroot()) { 
                    var segmentnode = this.base().segmentnext()
                } else {
                    var segmentnode = this.base()
                }

                if (segmentnode.isroot()) { return undefined }
                return segmentnode.sortvalue()
            }

            this.segmentceil = function() {
                var segmentnode = this.segmentnext().base().segmentprev()
                if (segmentnode.isroot()) { return undefined }

                return segmentnode.sortvalue()
            }

            this.valueinsegment = function(search, option) {
                return segmentvaluecompare(search, this.segmentfloor(), this.segmentceil(), option)
            }
        })

        this.debugbehavior = _.behavior(function() {
            this.debugout = function() {}
            this.debugvalidate = function() {
                var errors = (this._segmentup ? this._segmentup.debugvalidate() : [])

                //var test childcount of this segment
                var cursor = this.segmentdown()
                var childcount = 0

                while (!cursor.isroot()) {
                    childcount++
                    cursor = cursor.segmentnext()
                    if (cursor._upsegment) { break }
                }

                if (childcount != this._childcount) { 
                    errors.push("Child count mismatch") 
                }
                if (!this._nextsegment || this._nextsegment._prevsegment !== this) { errors.push("Next segment mismatch") }
                if (!this._prevsegment || this._prevsegment._nextsegment !== this) { errors.push("Prev segment mismatch") }
                if (this._downsegment._upsegment !== this) { errors.push("Down segment mismatch") }
                if (!this._upsegment && this._base._topsegment !== this) { errors.push("Up segment mismatch") } 
                return errors.length ? errors : undefined
            }
        })
    })
})
