//*************************************************************************************************
// skiplistnode - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistnode", function(_) {    

    var valuecompare = function(searchvalue, matchvalue, option) {
        switch(option) {
            case "<=":
                return searchvalue <= matchvalue
            case ">=":
                return searchvalue >= matchvalue
            case ">":
                return searchvalue > matchvalue
            case "<":
                return searchvalue < matchvalue
            default: // "==" or undefined
                return searchvalue == matchvalue
        }
    }

    _.define.linkedlistnode("skiplistnode", function (supermodel) {
        this._upsegment = undefined
        this._topsegment = undefined            
        this._level = 1

        this.constructbehavior = _.behavior(function() {
            this.assign = function(cursor, index) {
                supermodel.assign.call(this, cursor, index)

                //todo: For now we do a simple random level 
                if (!this._topsegment) {
                    var level = _.math.logarithmicchance(this.list().segmentsize(), this.list().segmentlevel())

                    if (level > 1) {
                        this._upsegment = _.model.skiplistsegment(this, level - 1)
                    } else {
                        this._topsegment = this
                    }
                }

                if (this._upsegment) {  
                    this._upsegment.link()
                }

                this.segmentleftup().calcsegment(true, true)

                return this
            }

            this.unlink = function() {
                if (this._upsegment) { this._upsegment.unlink() }
                this._topsegment = undefined
                
                var nodeprev = this._nodeprev
                supermodel.unlink.call(this)
                nodeprev.segmentleftup().calcsegment(false, true)
                return this
            }

            this.destroy = function() {
                this.unlink()
                return undefined
            }
        })

        this.modelbehavior = _.behavior(function() {
            this.value = function() { 
                return this._value
            }

            this.sortvalue = function(list) { 
                list = list || this.list()
                var sortvaluename = list.sortvaluename()
                if (sortvaluename) { return this._value.get(sortvaluename) }
                return this._value
            }          

            this.orderindex = function(relativenode) {
                if (this.isroot()) { return 0 }
                if (relativenode) { return this.orderindex() - relativenode.orderindex() }

                if (this._upsegment) { return this._upsegment.orderindex() + 1 }
                return this._nodeprev instanceof _.model.skiplist? 1: this._nodeprev.orderindex() + 1
            }           
        })

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function() { return false }
            this.base = function() { return this }
            this.segmenttop = function() { return this._topsegment }
            this.level = function() { return 1 }

            this.segmentnext = function() { return this._nodenext }            
            this.segmentprev = function() { return this._nodeprev }
            this.segmentdown = function() { return undefined }

            this.segmentleftup = function() {
                if (this._upsegment) {  return this._upsegment }
                if (this.isroot()) { return undefined }

                var cursor = this

                while (cursor) {
                    if (cursor._upsegment) { return cursor._upsegment }
                    cursor = cursor._nodeprev
                }
            }
            
            this.segmentrightup = function() { return this.segmentleftup()._nextsegment }                
            this.segmentup = function() { return this._upsegment || undefined }
        })
        
        this.searchbehavior = _.behavior(function() {
            this.valueinsegment = function(searchvalue, option) {
                return valuecompare(searchvalue, this.sortvalue(), option)
            }
        })
               
        this.debugbehavior = _.behavior(function () {            
            this.debugout = function() {
                var result = this.value() + ", segments ["                
                var cursor = this.segmentup()

                while (cursor) {
                    result += cursor._childcount
                    cursor = cursor.segmentup()
                    if (cursor) { result += ", " }
                }
                result += "]"
                return result
            }

            this.debugvalidate = function() {
                var errors = (this._upsegment? this._upsegment.debugvalidate(): undefined)
                return errors? errors: undefined
            }
        })            
    })
})