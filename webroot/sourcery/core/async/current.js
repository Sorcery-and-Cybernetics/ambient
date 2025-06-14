//*****************************************************************************************************************
// current - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

_.ambient.module("current", function(_) {
    _.define.object("current", function(supermodel) {
        this.value = _.property(undefined)
        this.state = _.property(undefined)
        
        this._currentwave = undefined
        this._spawns = undefined
        this._onfulfilled = undefined
        this._onrejected = undefined

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