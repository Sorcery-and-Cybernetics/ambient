//*************************************************************************************************
// skiplistsegmentlevel - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
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
                if (this._upsegment) { this._upsegment.unlink() }
                this._prevsegment._nextsegment = this._nextsegment
                this._nextsegment._prevsegment = this._prevsegment
                this._prevsegment = undefined
                this._nextsegment = undefined
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
                    index += cursor._childcount

                    if (cursor.isroot()) { break }
                }
                return index
            }  
            
            this.calcsegment = function(calcprevsegment, recursive) {
                var childcount = 0

                var cursor = this.segmentdown()

                var segmentright = this._nextsegment
                var segmentend = segmentright.segmentdown()

                if (!cursor.isroot() && calcprevsegment){
                    this.segmentprev().calcsegment(false, false)
                }

                do {
                    if (cursor instanceof _.model.skiplistsegment) { 
                        childcount += cursor._childcount
                    } else if (cursor instanceof _.model.skiplistnode) {
                        childcount++
                    }
                    cursor = cursor.segmentnext()
                } while (cursor != segmentend)

                this._childcount = childcount


                if (recursive) {
                    var segmentleftup = this.segmentleftup()

                    if (calcprevsegment) {
                        if (segmentleftup.isroot() || this.segmentprev().segmentleftup() == segmentleftup) {
                            calcprevsegment = false
                        }
                    }

                    if (segmentleftup) {
                        segmentleftup.calcsegment(calcprevsegment, recursive)
                    }
                } 
                return this
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

                if (!this._nextsegment || this._nextsegment._prevsegment !== this) { errors.push("Next segment mismatch") }
                if (!this._prevsegment || this._prevsegment._nextsegment !== this) { errors.push("Prev segment mismatch") }
                if (this._downsegment._upsegment !== this) { errors.push("Down segment mismatch") }
                if (!this._upsegment && this._base._topsegment !== this) { errors.push("Up segment mismatch") } 
                return errors.length ? errors : undefined
            }
        })
    })
})
