//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("modelmutation", function(_) {

    var makereadabledate = function (value) {
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
        this.method = _.property("")
        this.grootid = _.property("")
        this.uid = _.property("")
        this.parent = _.property("")     // may contain "parent:model"
        this.model = _.property("")
        this.date = _.property("").onset(function(value) { return makereadabledate(value) })       // "YYYYMMDD:HHmmSS"
        this.value = _.property(null)

        this.construct = function (method, grootid, uid, parent, model, date, value) {
            this.method(method)
            this.grootid(grootid)
            this.uid(uid)
            this.parent(parent)
            this.model(model)
            this.date(makereadabledate(date))
            this.value(value)
        }

        this.json = function (data) {
            if (data) {
                this.method(data[0] || "")
                this.grootid(data[1] || "")
                this.uid(data[2] || "")
                this.parent(_.leftof$(data[3], ":") || "")
                this.model(_.rightof$(data[3], ":") || "")
                this.date(data[4] || "")
                this.value(data[5])
                return this

            } else {
                return [
                    this.method()
                    , this.grootid()
                    , this.uid()
                    , _.combine$(this.parent(), ":", this.model()) 
                    , this.date()
                    , this.value()
                ]
            }
        }
    })
})