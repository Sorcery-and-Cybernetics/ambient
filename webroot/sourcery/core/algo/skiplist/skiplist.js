//*************************************************************************************************
// skiplist - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplist", function(_) {    
    _.define.core.linkedlist("core.skiplist", function (supermodel) {
        return {
            __upsegment: null
            , __topsegment: null

            , __level: 1
            , __segmentsize: 8
            , __segmentlevel: 8

            , __issortlist: false

            , objectbehavior: _.behavior({
                initialize: function() {
                    this.__nextnode = this
                    this.__prevnode = this

                    this.__upsegment = _.make.core.skiplistsegment(this, this.__segmentlevel)
                }
            })

            , skiplistnavigationbehavior: _.behavior({
                isroot: function () { return true }
                , base: function () { return this }
                , top: function () { return this.__topsegment }

                , segmentnext: function () {
                    return this.__nextnode
                }
                
                , segmentprev: function () { 
                    return this.__prevnode
                }

                , segmentdown: function () { 
                    return null
                }

                , segmentup: function () { 
                    return this.__upsegment || undefined
                }
            })

            , skiplistbehavior: _.behavior({
                __makenode: function(item) {
                    if (item instanceof _.make.skiplistnode) { return item } 
                    return _.make.linkedlistnode(item)
                }  

                , issortlist: function(value) {
                    if (value === undefined) { return this.__issortlist }

                    if (this.__issortlist != value) {
                        this.__issortlist = value
                        this.__isskiplist = true
                    }
                    return this
                }

                , isorderlist: function() {
                    return !this.__issortlist
                }

                , segmentsize: function(value) { 
                    if (value === undefined) { return this.__segmentsize }
                    
                    if (value >= 2) { 
                        this.__segmentsize = value
                    }
                    return this
                }

                , segmentlevel: function(value) { 
                    if (value === undefined) { return this.__segmentlevel }

                    if (value > this.__segmentlevel) { 
                        this.__segmentlevel = value
                        _.make.skiplistsegment(this, value - 1)
                    }
                    return this
                }  
            })   
            
            , debugbehavior: _.behavior({
                debugout: function () {
                    var result = []

                    this.foreach(function(node) {
                        result.push(node.value()) 
                    })
            
                    return result
                }

                , debugvalidate: function() {
                    var errors = []
                    var cursor = this.firstnode()
                    var count = 0
 
                    var errors = supermodel.debugvalidate.call(this) || []

                    while (cursor && cursor != this) {
                        var result = cursor.debugvalidate()

                        if (result) { errors.concat(result) }
                        cursor = cursor.nextnode()
                    }

                    var segment = this.__upsegment
                    var segmentlevel = 1

                    while (segment) {
                        var cursor = segment
                        var count = 0

                        do {
                            count += cursor.__childcount
                            cursor = cursor.segmentnext()
                        } while (!cursor.isroot())

                        if (count != this.count()) { errors.push("Segment level " + segmentlevel + " childcount mismatch: " + count + ", expected: " + this.count()) }
                        segmentlevel += 1
                        segment = segment.segmentup()
                    }

                    return errors.length? errors : undefined
                }
            })            

        }
    })
})