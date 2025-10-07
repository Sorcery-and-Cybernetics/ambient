//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("wave", function(_) {
    _.define.object("wavenode", function(supermodel) {
        this._name = "then"
        this._parent = null 
        this._source = null   
        this._prevwave = null
        this._nextwave = null

        this._child = null
        this._displayindent = 0
        this._displaylevel = 0
        this._orderindex = 1

        this._isblock = false
        this._isblockend = false
        this._issoftblock = false
        this._issoftblockend = false

        this.construct = function(source) {
            this._source = source
        }
       
        this.assignto = function (parent) {
            if (!parent) { throw "error" }
            me = this

            //find the correct parent
            if (me._issoftblockend || me._isblockend) {
                while (parent && (!parent._isblock)) {
                    parent = parent._parent
                }
            } else if (parent._isblockend) {
                parent = parent._parent._parent

                while (parent && (!parent._isblock && !parent._issoftblock)) {
                    parent = parent._parent
                }                    
            }

            //Add me to parent
            if (parent._child) {
                var root = parent._child
                if (!root._prevwave) {
                    root._nextwave = me
                    root._prevwave = me
                } else {
                    me._prevwave = root._prevwave
                    me._orderindex = me._prevwave._orderindex + 1
                    root._prevwave._nextwave = me
                    root._prevwave = me
                }
                me._parent = parent

            } else {
                parent._child = me
                me._parent = parent
            }

            if (!parent._isblock) {
                me._displaylevel = parent._displaylevel
            } else {
                me._displaylevel = parent._displaylevel + 1
            }

            return me
        }

        this.debugout = function() {
            var level = this._displaylevel + (this._displayindent == -1? -1: 0)
            var result = [(this._sameline? "": _.string$(level, "\t")) + this._name] // + (this._parent? " (" + this._parent._name + ")": "")]

            if (this._child) { 
                var childresult = this._child.debugout()

                if (this._child._sameline) {
                    result[0] += " " + childresult[0]
                    childresult.shift()
                }
                result = result.concat(childresult) 
            }

            if (this._nextwave) {  
                result = result.concat(this._nextwave.debugout())
            }

            return result
        }
    })

    _.define.wavenode("sleep", function(supermodel) {
        this._name = "sleep"
        this._ms = 0

        this.construct = function(ms) {
            this._ms = ms           
        }

        this.run = function(current) {
            setTimeout(function() { current.next() }, this._ms)
            current.pause()
        }
    }) 
    
    _.define.wavenode("do", function(supermodel) {
        this._name = "do"
        this._isblock = false
        this._isblockend = false
        this._issoftblock = true
        this._issoftblockend = false
        this._sameline = true
    })

    _.define.wavenode("if", function(supermodel) {
        this._name = "if"
        this._isblock = true
        this._isblockend = false
        this._issoftblock = false
        this._issoftblockend = false

        this.construct = function(condition) {
            this._condition = condition
        }

        // this.run = function(current) {
        //     current.do(this._condition)
        //         .thendo(function(value){
        //             if (value) { current.do(this._whentrue) }
        //             else { current.do(this._whenfalse) }
        //         })
        //         .thendo(function() {
        //             current.do(this._nextwave)
        //         })
        // }
    })

    _.define.wavenode("elseif", function(supermodel) {
        this._name = "elseif"
        this._isblock = false
        this._isblockend = false
        this._issoftblock = true
        this._issoftblockend = true
        this._displayindent = -1

        this.construct = function(condition) {
            this._condition = condition
        }

        // this.run = function(current) {
        //     current.do(this._condition)
        //         .thendo(function(value){
        //             if (value) { current.do(this._whentrue) }
        //             else { current.do(this._whenfalse) }
        //         })
        //         .thendo(function() {
        //             current.do(this._nextwave)
        //         })
        // }
    })    

    _.define.wavenode("else", function(supermodel) {
        this._name = "else"
        this._displayindent = -1
        this._isblock = false
        this._isblockend = false
        this._issoftblock = true
        this._issoftblockend = true

        this.construct = function() {}

        // this.run = function(current) {
        //     if (fn) {
        //         current.spawn(fn)
        //             .ondone(function(value){
        //                 current.indent()
        //             })
        //     } else {
        //         current.next()
        //     }
        // }
    })

    _.define.wavenode("end", function(supermodel) {
        this._name = "end"
        this._isblock = false
        this._displayindent = -1
        this._isblockend = true
        this._issoftblock = false
        this._issoftblockend = false

        this.construct = function() {}
    })

    _.define.wavenode("wave", function() {
        this._name = "wave"
        this._isblock = true

        this._lastcreated = undefined

        this.then = function(nextwave) {
            if (!nextwave) { throw "Error: No wave provided" }

            if (_.isfunction(nextwave)) { nextwave = _.model.wavenode(nextwave) }

            nextwave.assignto(this._lastcreated || this)
            this._lastcreated = nextwave            
            return this
        }

        this.sleep = function(ms) {  
            return this.then(_.model.sleep(ms)) 
        }
        this.do = function(fn) { return this.then(_.model.do(fn)) }
        this.if = function(fn) { return this.then(_.model.if(fn)) }
        this.elseif = function(fn) { return this.then(_.model.elseif(fn)) }
        this.else = function(fn) { return this.then(_.model.else(fn)) }
        this.end = function() { return this.then(_.model.end()) }

        this.oncancel = _.model.basicsignal()
        this.cancel = function() { this.oncancel() }    

    })

    _.wave = function() {
        return _.model.wave()
    }

}).ontest("wave", function(_) {
    
    var wavetest = _.model.wave()
        .sleep(1)
        wavetest.if(function() { return true }).do()
            wavetest.then(function() { return "Hello" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })
        wavetest.elseif(function() { return false }).do()
            .then(function() { return "Hello" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })
        .else().do()
            .then(function() { return "Goodbye" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })    
        .end()
        .sleep(1)
        .end()

    _.console.write(wavetest.debugout().join("\n") + "\n")
})


 
        // this.getnext = function(current) {
        //     return this._next
        // }

        // this.next = function(source) {
        //     this._next = new _.model.wave(source).assignto(this._parent)
        //     this._next._prev = this
        //     return this._next
        // }

        // this.run = function(current) {        
        //     try {
        //         const result = this._source.call(current, current.value)

        //         if (result != null) {
        //             if (result instanceof _.model.wave) {
        //                 current.spawn(result)

        //             } else if (_.ispromise(result)) {
        //                 result.then(function(value) { current.next(value, 'resolved') }, function(error) { current.next(error, 'rejected') })                        

        //             } else {
        //                 current.next(result, 'resolved')
        //             }
        //         }

        //     } catch (err) {
        //         current.next(err, 'rejected')
        //     }
        // }