//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("modelmutation", function(_) {
    var safedate = function (value) {
        if (value) {
            if (!_.isdate(value)) {
                value = new Date(value)
            }
        } else {
            value = new Date()
        }

        return value
    }

    var readabledate = function (value) {
        if (value) {
            if (!_.isdate(value)) {
                value = new Date(value)
            }
        } else {
            value = new Date()
        }

        return _.formatdate$(value, "YYYYMMDD:HHmmSS")
    }
    
    _.define.object("modelmutation", function (supermodel) {
        this.method = _.model.property(null)
        this.grootid = _.model.property(null)
        this.uid = _.model.property(null)
        this.parentid = _.model.property(null)  
        this.date = _.model.property(null) 
        this.value = _.model.property(null)

        this.construct = function (method, grootid, uid, parentid, value, date) {
            if (method) {this.method(method) }
            if (grootid) { this.grootid(grootid) }
            if (uid) {  this.uid(uid) }
            if (parentid) { this.parentid(parentid) }
            if (value) { this.value(value) }
            this.date(safedate(date))
        }

        this.json = function (data) {
            if (data) {
                this.method(data[0] || null)
                this.grootid(data[1] || null)
                this.uid(data[2] || null)
                this.parentid(data[3] || null)
                this.date(data[4] || null)
                this.value(readabledate(data[5]))
                return this

            } else {
                return [
                    this.method()
                    , this.grootid()
                    , this.uid()
                    , this.parentid()
                    , this.date()
                    , this.value()
                ]
            }
        }
    })
})