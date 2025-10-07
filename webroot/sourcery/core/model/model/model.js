//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("model", function(_) {
    _.define.object("model", function (supermodel) {
        this._self = null
        this.uid = _.model.property()
        this.groot = _.model.property()
        this.grootid = function() { return (this._groot? this._groot.uid(): null) }

        this.assignto = function(parent, name, orderindex) {
            if (name) { this._name = name }
            _.modelagent.registermodel(parent, this, orderindex)
        }        

        this.self = function () {
            if (this.hasself()) { return this._self._self }
            return null
        }

        this.selfnode = function() {
            if (this.hasself()) { return this._self }
            return null
        }
        
        this.hasself = function() { return this._self? true: false }

        //Dirty mode:
        // < 0 : control is locked
        // 0 : nothing to repaint
        // 1: repaint self
        // 2 : force repaint on all children
        // 4 : repaint child

        // , setdirty: function (dirtymode) {
        //     if (this.dirty < 0) { return }

        //     //            if (this.dirty != 0) { return }
        //     if (!this.dirty) {
        //         if (this._parent) {
        //             this._parent.setdirty(4)
        //         } else {
        //             _.dom.setdirty()
        //         }
        //     }

        //     this.dirty |= (dirtymode || 1);
        //     return this;
        // } 
        
        this.onchildchange = _.model.signal()

    })
})