//*************************************************************************************************
// skiplistsegmentlevel - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistsegment", function (_) {
    _.define.core.object("core.skiplistsegment", function (supermodel) {
        return {
            __base: null
            , __level: 0
            , __upsegment: null
            , __downsegment: null

            , __nextsegment: null
            , __prevsegment: null

            , __childcount: 0

            , objectbehavior: _.behavior({
                initialize: function(segmentdown, level) {
                    if (!this.__downsegment) {
                        this.__level = segmentdown.__level + 1
                        this.__downsegment = segmentdown
                        this.__base = (segmentdown instanceof _.make.core.skiplistsegment? segmentdown.__base: segmentdown)
                        this.__base.__topsegment = this

                        if (this.isroot()) {
                            this.__nextsegment = this
                            this.__prevsegment = this
                        } else {
                            this.link()
                        }
                    }

                    if (level > 1) {
                        if (this.__upsegment) {
                            this.__upsegment.initialize(this, level - 1)
                        } else {
                            this.__upsegment = _.make.core.skiplistsegment(this, level - 1) 
                        }
                    }                    
                }
            })

            , skiplistnavigationbehavior: _.behavior({
                isroot: function () { return this.__base.isroot() }
                , base: function () { return this.__base }
                , top: function () { return this.__base.__topsegment }
                , level: function() { 
                    var result = 0
                    var cursor = this

                    while (cursor) {
                        result++
                        cursor = cursor.__downsegment
                    }
                    return result
                }

                , segmentnext: function () {
                    if (this.__nextsegment) { 
                        return this.__nextsegment 
                    } else {
                        return this.segmentdown().segmentrightup()
                    }
                }
                
                , segmentprev: function () { 
                    if (this.__prevsegment) { 
                        return this.__prevsegment 
                    } else {
                        return this.segmentdown().segmentleftup()
                    }
                }

                , segmentdown: function () { 
                    return this.__downsegment
                }

                //todo: we can optimize by dual using __upsegment
                , segmentleftup: function() {
                    if (this.__upsegment) {  return this.__upsegment }
                    if (this.isroot()) { return null}

                    var cursor = this

                    while (cursor) {
                        if (cursor.__upsegment) { return cursor.__upsegment }
                        cursor = cursor.__prevsegment
                    }
                }
                , segmentrightup: function() {
                    return this.segmentleftup().__nextsegment
                }

                //todo: Split segment into 2 functions. One that returns the direct up segment, other that returns the segment group.
                , segmentup: function () { 
                    return this.__upsegment || undefined
                }
            })

            , skiplistbehavior: _.behavior({
                link: function() {
                    this.__nextsegment = this.segmentnext()
                    this.__prevsegment = this.segmentprev()

                    this.__nextsegment.__prevsegment = this
                    this.__prevsegment.__nextsegment = this

                    if (this.__upsegment) { this.__upsegment.link() }
                }

                , unlink: function() {
                    if (this.__upsegment) { this.__upsegment.unlink() }
                    this.__prevsegment.__nextsegment = this.__nextsegment
                    this.__nextsegment.__prevsegment = this.__prevsegment
                    this.__prevsegment = null
                    this.__nextsegment = null
                }

                , calcsegment: function(calcprevsegment, recursive) {
                    var childcount = 0

                    var cursor = this.segmentdown()

                    var segmentright = this.__nextsegment
                    var segmentend = segmentright.segmentdown()

                    if (!cursor.isroot() && calcprevsegment){
                        this.segmentprev().calcsegment(false, false)
                    }

                    do {
                        if (cursor instanceof _.make.core.skiplistsegment) { 
                            childcount += cursor.__childcount
                        } else if (cursor instanceof _.make.core.skiplistnode) {
                            childcount++
                        }
                        cursor = cursor.segmentnext()
                    } while (cursor != segmentend)

                    this.__childcount = childcount


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
                }
            })

            , debugbehavior: _.behavior({
                debugout: function() {}
                , debugvalidate: function() {
                    var errors = (this.__segmentup? this.__segmentup.debugvalidate(): [])

                    if (!this.__nextsegment || this.__nextsegment.__prevsegment !== this) { errors.push("Next segment mismatch") }
                    if (!this.__prevsegment || this.__prevsegment.__nextsegment!== this) { errors.push("Prev segment mismatch") }
                    if (this.__downsegment.__upsegment !== this) { errors.push("Down segment mismatch") }
                    if (!this.__upsegment && this.__base.__topsegment !== this) { errors.push("Up segment mismatch") } 
                    return errors.length? errors: undefined
                }
            })
        }
    })
})