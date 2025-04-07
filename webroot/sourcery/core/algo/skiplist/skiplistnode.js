//*************************************************************************************************
// skiplistnode - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistnode", function(_) {    
    _.define.core.linkedlistnode("core.skiplistnode", function (supermodel) {
        return {
            __upsegment: null
            , __topsegment: null            
            , __level: 1

            , objectbehavior: _.behavior({
                initialize: function(value) {
                    this._value = value
                }

                , destroy: function () {
                    this.unlink()
    
                    return null
                }                  
            })

            , skiplistnavigationbehavior: _.behavior({
                isroot: function () { return false }
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

                , segmentleftup: function() {
                    if (this.__upsegment) {  return this.__upsegment }
                    if (this.isroot()) { return null }

                    var cursor = this

                    while (cursor) {
                        if (cursor.__upsegment) { return cursor.__upsegment }
                        cursor = cursor.__prevnode
                    }
                } 
                
                , segmentrightup: function() {
                    return this.segmentleftup().__nextsegment
                }                

                , segmentup: function () { 
                    return this.__upsegment || undefined
                }
            })            

            , skiplistbehavior: _.behavior({
                assign: function(cursor, index) {
                    supermodel.assign.call(this, cursor, index)

                    //todo: For now we do a simple random level 
                    if (!this.__topsegment) {
                        var level = _.math.logarithmicchance(this.list().segmentsize(), this.list().segmentlevel())

                        if (level > 1) {
                            this.__upsegment = _.make.core.skiplistsegment(this, level - 1)
                        } else {
                            this.__topsegment = this
                        }
                    }

                    if (this.__upsegment) {  
                        this.__upsegment.link() 
                    }

                    this.segmentleftup().calcsegment(true, true)

                    return this
                }                

                , unlink: function() {
                    this.__topsegment = null
                    if (this.__upsegment) { this.__upsegment.unlink() }
                    
                    var prevnode = this.__prevnode
                    supermodel.unlink.call(this)
                    prevnode.segmentleftup().calcsegment(false, true)
                }

                , position: function(relativenode) {
                    var position = 0




                    if (relativenode) {}

                }
            })
            
            , debugbehavior: _.behavior({
                debugout: function() {}
                , debugvalidate: function() {
                    var errors = (this.__segmentup? this.__segmentup.debugvalidate(): [])

                    return errors.length? errors: undefined
                }
            })            
        }
    })
})