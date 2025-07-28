//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("control", function(_) {
    _.define.enum("controlphase", ["destroyed", "none", "assigned", "loaded", "showed"], -1)

    _.define.model("control", function (supermodel) {

        this.tagname = "DIV"
        this.tagtype = ""


        this._phase = 0
        this.phases = _.enum.controlphase

        this.behavior = _.efb.none
        this.behaviors = _.efb   
        
        this.assign = function(parent, name, orderindex) {
            this._parent = parent
            this._name = name

            this._parent = parent || _.dom.page
            this._parent._childinsert(this, name, orderindex)

            this.setdirty()
            this._phase = this.phases.assigned

            return this
        }

    })
})