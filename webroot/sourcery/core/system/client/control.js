//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("dombody", function(_) {
    _.define.enum("controlstate", ["destroyed", "none", "created", "loaded", "showed"], -1)

    _.define.model("documentbody", function (supermodel) {

        this.tagname = "DIV"
        this.tagtype = ""


        this.controlstate = 0
        this.controlstates = _.enum.controlstate

        this.behavior = _.efb.none
        this.behaviors = _.efb   
        
        this.assign = function(parent, name, orderindex) {
            this._parent = parent
            this._name = name

            this._parent = parent || _.dom.page
            this._parent._childinsert(this, name, orderindex)

            this.setdirty()
            this.controlstate = this.controlstates.created

            return this
        }

        this._assignchild = function (child, name, orderindex) {
            if (orderindex != null) {
                var controls = this.control[name]
                if (!controls) {
                    controls = this.control[name] = []
                    if (!this[name]) { this[name] = controls }
                }

                if (orderindex < 0) { orderindex = controls.length - orderindex }
                if ((orderindex < 0) || (orderindex > controls.length)) { orderindex = 0 }

                if (orderindex == 0) {
                    controls.push(child)
                    child.orderindex = controls.length
                } else {
                    controls.splice(orderindex - 1, 0, child)
                    controlarray.reindex(controls, orderindex)
                }
            } else {
                if (this[name]) {
                    throw name + " already exists in " + parent.name
                }

                this[name] = child
                this.control[name] = child
            }
        }        

    })
})