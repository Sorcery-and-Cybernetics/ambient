//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("skiplistnode", function(_) {    

    var valuecompare = function(searchvalue, matchvalue, compareoption) {
        switch(compareoption) {
            case "<=":
                return searchvalue <= matchvalue
            case ">=":
                return searchvalue >= matchvalue
            case ">":
                return searchvalue > matchvalue
            case "<":
                return searchvalue < matchvalue
            default: // "==" or null
                return searchvalue == matchvalue
        }
    }

    _.define.linkedlistnode("skiplistnode", function (supermodel) {
        this._upsegment = null
        this._topsegment = null            
        this._level = 1

        this.constructbehavior = _.behavior(function() {
            this.assign = function(cursor, index) {
                supermodel.assign.call(this, cursor, index)

                //todo: For now we do a simple random level 
                // if (!this._topsegment) {
                //     var level = _.math.logarithmicchance(this.list().segmentsize(), this.list().segmentlevel())

                //     if (level > 1) {
                //         this._upsegment = _.model.skiplistsegment(this, level - 1)
                //     } else {
                //         this._topsegment = this
                //     }
                // }

                // if (this._upsegment) {  
                //     this._upsegment.link()
                // }

                this._topsegment = this

                this.segmentleftup().calcsegment(true, true)

                return this
            }

            this.unlink = function() {
                if (this._upsegment) { this._upsegment.unlink() }
                this._topsegment = null
                
                var prevnode = this._prevnode
                supermodel.unlink.call(this)
                prevnode.segmentleftup().calcsegment(false, true)
                return this
            }

            this.destroy = function() {
                this.unlink()
                return null
            }
        })

        this.modelbehavior = _.behavior(function() {
            this.name = function() { 
                return this._value.name() 
            }
            
            this.value = function() { 
                return this._value
            }

            this.sortvalue = function(list) { 
                list = list || this.list()
                var sortby = list.sortby()
                if (sortby) { return this._value.get(sortby) }
                return this._value
            }           

            this.orderindex = function(relativenode) {
                if (this.isroot()) { return 0 }
                if (relativenode) { return this.orderindex() - relativenode.orderindex() }

                if (this._upsegment) { return this._upsegment.orderindex() + 1 }
                return this._prevnode instanceof _.model.skiplistroot? 1: this._prevnode.orderindex() + 1
            }           
        })

        this.navigationbehavior = _.behavior(function() {
            this.isroot = function() { return false }
            this.base = function() { return this }
            this.segmenttop = function() { return this._topsegment }
            this.level = function() { return 1 }

            this.segmentnext = function() { return this._nextnode }            
            this.segmentprev = function() { return this._prevnode }
            this.segmentdown = function() { return null }

            this.segmentleftup = function() {
                if (this._upsegment) {  return this._upsegment }
                if (this.isroot()) { return null }

                var cursor = this

                while (cursor) {
                    if (cursor._upsegment) { return cursor._upsegment }
                    cursor = cursor._prevnode
                }
            }
            
            this.segmentrightup = function() { return this.segmentleftup()._nextsegment }                
            this.segmentup = function() { return this._upsegment || null }
        })
        
        this.searchbehavior = _.behavior(function() {
            this.valueinsegment = function(searchvalue, compareoption) {
                return valuecompare(searchvalue, this.sortvalue(), compareoption)
            }
        })
               
        this.debugbehavior = _.behavior(function () {            
            this.debugout = function() {
                var result = this.value() + ", segments ["                
                var cursor = this.segmentup()

                while (cursor) {
                    result += cursor._nodecount
                    cursor = cursor.segmentup()
                    if (cursor) { result += ", " }
                }
                result += "]"
                return result
            }

            this.debugvalidate = function() {
                var errors = (this._upsegment? this._upsegment.debugvalidate(): null)
                return errors? errors: null
            }
        })            
    })
})