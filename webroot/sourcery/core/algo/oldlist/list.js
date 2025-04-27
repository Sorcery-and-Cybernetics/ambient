//*************************************************************************************************
// linkedlist - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("list", function(_) {    
    _.define.listnode("list", function (supermodel) {
        return {
            __firstnode: null
            , __lastnode: null
            , _count: 0
            , _maxsegmentlevel: 0

            , __segmentup: null
            , __segmentdown: null
            , __isrootnode: true

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
                , firstnode: function () { return this.__firstnode == this? null: this.__firstnode }
                , lastnode: function () { return this.__lastnode == this? null: this.__lastnode }

                , __unlinknode: function (node) {
                    if (node.__list != this) { throw "Node not in list" }
                    this._count -= 1

                    if (node.__nodeprev == this) {
                        this.__firstnode = node.__nodenext
                    } else {
                        node.__nodeprev.__nodenext = node.__nodenext
                    }

                    if (node.__nodenext == this) {
                        this.__lastnode = node.__nodeprev
                    } else {
                        node.__nodenext.__nodeprev = node.__nodeprev
                    }

                    node.__nodenext = null
                    node.__nodeprev = null
                    node.__list = null

                    //unlink segments
                    // if (node.__segmentup) { node.__segmentup.unlink() }
                    // var cursor = node.__segmentup
                    // while (cursor && cursor != node) { 
                    //     cursor.unlink()
                    // }
                }

                , foreach: function(fn) {
                    var nodes = []
                    var cursor = this.firstnode()
                    
                    while (cursor && (cursor != this)) {
                        nodes.push(cursor)
                        cursor = cursor.__nodenext
                    }
    
                    _.foreach(nodes, fn)
                    return this
                }
   
            })
            
            , debugbehavior: _.behavior({
                debugvalidate: function() {
                    var errors = []
                    var cursor = this.__firstnode
                    var count = 0

                    while (cursor && cursor != this) {
                        count += 1

                        if (cursor.__list != this) { errors.push("Node not in list") }

                        if (!cursor.__nodeprev) { 
                            errors.push("Missing nodeprev") 
                        } else {
                            if (cursor.__nodeprev == this) {
                                if (this.__firstnode != cursor) { errors.push("Firstnode not pointing to this node") } 
                            } else {
                                if (cursor.__nodeprev.__nodenext != cursor) { errors.push("nodeprev not pointing to this node") }
                            }
                        }

                        if (!cursor.__nodenext) { 
                            errors.push("Missing nodenext") 
                        } else {
                            if (cursor.__nodenext == this) {
                                if (this.__lastnode != cursor) { errors.push("Lastnode not pointing to this node") }
                            } else {
                                if (cursor.__nodenext.__nodeprev != cursor) { errors.push("nodenext not pointing to this node") }
                            }
                        }
                        cursor = cursor.__nodenext
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
                var cursor = this.__firstnode

                while (cursor) {
                    var nodenext = cursor.__nodenext
                    this.__unlinknode(cursor)
                    cursor.destroy()
                    cursor = nodenext
                }

                if (this.__list) { this.__list.__unlinknode(this) }
                return null
            }             
        }
    })
})