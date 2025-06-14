//*****************************************************************************************************************
// wave - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************
_.ambient.module("wave", function(_) {
    _.define.object("wave", function(supermodel) {
        this._source = undefined   
        this._parent = undefined
        this._prev = undefined
        this._next = undefined

        this.construct = function(source, parent) {
            this._source = source
            this._parent = parent
            this._prev = null
            this._next = null
        }
 
        this.getnext = function(current) {
            return this._next
        }

        this.next = function(source) {
            this._next = new _.model.wave(source).assign(this._parent)
            this._next._prev = this
            return this._next
        }

        this.run = function(current) {        
            try {
                const result = this._source.call(current, current.value)

                if (result !== undefined) {
                    if (result instanceof _.model.wave) {
                        current.spawn(result)

                    } else if (_.ispromise(result)) {
                        result.then(function(value) { current.next(value, 'resolved') }, function(error) { current.next(error, 'rejected') })                        

                    } else {
                        current.next(result, 'resolved')
                    }
                }

            } catch (err) {
                current.next(err, 'rejected')
            }
        }

        this.oncancel = _.model.basicsignal()
        this.cancel = function() { this.oncancel() }    
    })

    // _.define.wave("wave.catch", function(supermodel) {
    //     this.getnext = function(current) {
    //         if (current.state === 'rejected') { return this._next }
    //         return null
    //     }
    // })

    // _.define.wave("wave.finalize", function(supermodel) {
    //     this.getnext = function(current) {
    //         return this._next
    //     }
    // })

    // _.define.wave("wave.when", function(supermodel) {
    //     this._condition = undefined

    //     this.construct = function(condition) {
    //         this._condition = condition
    //     }

    //     this.do = function(source) {
    //         //todo: go deeper level
    //         this._do = _.model.wave.do(source).assign(this._parent)
    //         return this._do
    //     }

    //     this.else = function(source) {
    //         this._else = _.model.wave(source).assign(this._parent)
    //         return this._else
    //     }        

    //     this.elseif = function(condition) {
    //         this._else = _.model.wave.elseif(condition).assign(this._parent)
    //         return this._else
    //     }
        
    //     this.endif = function() {
    //         return this
    //     }

    //     this.getnext = function(current) {
    //         return this._condition(current.value) ? this._do : this._else
    //     }
    // })

    // _.define.wave("wave.do", function(supermodel) {
    //     this.next = function(source) { 
    //         this._parent.next(source) }

    //     this.else = function(source) { 
    //         return this._parent.else(source) }
        
    //     this.elseif = function(condition) { 
    //         return this._parent.elseif(source) }
    // })

    // _.define.object("wave.else", function(supermodel) {
    //     this.endif = function() {
    //         return this._parent.endif()
    //     }      
    // })
})    


