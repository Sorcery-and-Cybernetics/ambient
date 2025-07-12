//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("current", function(_) {
    _.define.object("current", function(supermodel) {
        this.value = _.property(null)
        this.state = _.property(null)
        
        this._currentwave = null
        this._spawns = null
        this._onfulfilled = null
        this._onrejected = null

        this.next = function(value, state) {
            // do not continue until all spawns are finished
            if (this._spawns && this._spawns.some(function(spawn) { return !spawn.state })) {                
                throw new Error("Cannot complete: unfinished child currents remain.")
            }

            this.value(value)
            this.state(state)

            if (state === 'resolved') {
                if (this._onfulfilled) { this._onfulfilled.call(this, value) }

            } else if (state === 'rejected') {
                if (this._onrejected) { this._onrejected.call(this, value) }
            }

            const next = this._currentwave && this._currentwave.getnext(this)            
            if (next) { 
                next.run(this) 
            } else { 
                this.onfinish() 
            }
        }

        this.then = function(onfulfilled, onrejected) {
            this._onfulfilled = onfulfilled
            this._onrejected = onrejected
        }

        this.cancel = function() {
            this.state('canceled')            
            if (this._currentwave && this._currentwave.cancel) { this._currentwave.cancel() }            

            _.foreach(this._spawns, function(spawncurrent) {                
                spawncurrent.cancel()
            })

            if (this.onfinish) { this.onfinish() }            
        }

        this.spawn = function(wave) {
            if (!this._spawns) { this._spawns = [] }            

            var current = new _.model.current()
            this._spawns.push(current)            
            return current
        }

        this.ondone = _.model.signal()
        this.onerror = _.model.signal()
        this.onfinish = _.model.signal()
    })
})