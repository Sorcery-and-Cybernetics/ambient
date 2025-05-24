//*************************************************************************************************
// linkedlist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("list", function(_) {    
    _.define.listnode("list", function (supermodel) {
        return {
            _nodefirst: undefined
            , _nodelast: undefined
            , _count: 0
            , _maxsegmentlevel: 0

            , _segmentup: undefined
            , _segmentdown: undefined
            , _isrootnode: true

            , _isorderlist: false
            , _issortlist: false
            , _isskiplist: false

            , skiplistbehavior: _.behavior({
                issortlist: function(value) {
                    if (value === undefined) { return this._issortlist }

                    if (this._issortlist != value) {
                        this._issortlist = value
                        this._isskiplist(true)
                    }
                    return this
                }

                , _isorderlist: function(value) {
                    if (value === undefined) { return this._isorderlist }

                    if (this._isorderlist != value) { 
                        this._isorderlist = value
                        this._isskiplist(true)
                    }
                    return this
                }

                , _isskiplist: function(value) {
                    if (value === undefined) { return this._isskiplist }

                    if (this.count()) { throw "Cannot change list type after adding nodes" }

                    if (this._isskiplist != value) {
                        this._isskiplist = value
                        this.maxsegmentlevel(1)
                    }
                    return this
                }

                , maxsegmentlevel: function(value) { 
                    if (value === undefined) { return this._maxsegmentlevel }

                    if (value > this._maxsegmentlevel) { 
                        this._maxsegmentlevel = value
    //                    this.addsegments(this, this._maxsegmentlevel)
                    }
                    return this
                }  
            })          

            , linkedlistbehavior: _.behavior({
                count: function () { return this._count }
                , nodefirst: function () { return this._nodefirst == this? undefined: this._nodefirst }
                , nodelast: function () { return this._nodelast == this? undefined: this._nodelast }

                , _unlinknode: function (node) {
                    if (node._list != this) { throw "Node not in list" }
                    this._count -= 1

                    if (node._nodeprev == this) {
                        this._nodefirst = node._nodenext
                    } else {
                        node._nodeprev._nodenext = node._nodenext
                    }

                    if (node._nodenext == this) {
                        this._nodelast = node._nodeprev
                    } else {
                        node._nodenext._nodeprev = node._nodeprev
                    }

                    node._nodenext = undefined
                    node._nodeprev = undefined
                    node._list = undefined

                    //unlink segments
                    // if (node._segmentup) { node._segmentup.unlink() }
                    // var cursor = node._segmentup
                    // while (cursor && cursor != node) { 
                    //     cursor.unlink()
                    // }
                }

                , foreach: function(fn) {
                    var nodes = []
                    var cursor = this.nodefirst()
                    
                    while (cursor && (cursor != this)) {
                        nodes.push(cursor)
                        cursor = cursor._nodenext
                    }
    
                    _.foreach(nodes, fn)
                    return this
                }
   
            })
            
            , debugbehavior: _.behavior({
                debugvalidate: function() {
                    var errors = []
                    var cursor = this._nodefirst
                    var count = 0

                    while (cursor && cursor != this) {
                        count += 1

                        if (cursor._list != this) { errors.push("Node not in list") }

                        if (!cursor._nodeprev) { 
                            errors.push("Missing nodeprev") 
                        } else {
                            if (cursor._nodeprev == this) {
                                if (this._nodefirst != cursor) { errors.push("nodefirst not pointing to this node") } 
                            } else {
                                if (cursor._nodeprev._nodenext != cursor) { errors.push("nodeprev not pointing to this node") }
                            }
                        }

                        if (!cursor._nodenext) { 
                            errors.push("Missing nodenext") 
                        } else {
                            if (cursor._nodenext == this) {
                                if (this._nodelast != cursor) { errors.push("nodelast not pointing to this node") }
                            } else {
                                if (cursor._nodenext._nodeprev != cursor) { errors.push("nodenext not pointing to this node") }
                            }
                        }
                        cursor = cursor._nodenext
                    }

                    if (count != this._count) { errors.push("Count mismatch") }
                    if (cursor != this) { errors.push("This list is not a full circle") }

                    if (errors.length > 0) { return _.debug("List validation errors: ", errors) }
                    return undefined
                }

                , debugout: function () {
                    var result = []

                    this.foreach(function(node) {
                        result.push(node.value()) 
                    })
            
                    return result
                }
            })
            
            , destroy: function () {
                var cursor = this._nodefirst

                while (cursor) {
                    var nodenext = cursor._nodenext
                    this._unlinknode(cursor)
                    cursor.destroy()
                    cursor = nodenext
                }

                if (this._list) { this._list._unlinknode(this) }
                return undefined
            }             
        }
    })
})