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
        this._blockparent = null 
        this._prevwave = null
        this._nextwave = null

        this._child = null
        this._indent = 0
        this._level = 0
        this._orderindex = 1

        this._branches = ["_child"]

        this._isblock = false
        this._isblockend = false
        // this._blockname = ""
        // this._blockindex = 0
        // this._blockparentname = ""
        // this._blockparentbranchname = ""


        this.construct = function(source) {
            this._source = source
        }

        this.then = function (nextwave) {
            if (!nextwave) { throw "Error: No wave provided" } 

            var parent
            if (this._isblockend) {
                parent = this._parent._parent
            } else if (this._isblock) {
                parent = this
            } else {
                parent = this._parent
            }

            // switch (this._indent) {
            //     case -1:
            //         parent = this._parent._parent
            //         break
            //     case 0:
            //         parent = this._parent
            //         break
            //     case 1:
            //         parent = this
            //         break
            // }

            if (parent._child) {
                //append after last child of this parent. It is possible that there is only 1 child, so no next and prevwave defined
                var root = parent._child

                if (!root._prevwave) {
                    root._nextwave = nextwave
                    root._prevwave = nextwave

                } else {
                    nextwave._prevwave = root._prevwave
                    nextwave._orderindex = nextwave._prevwave._orderindex + 1

                    root._prevwave._nextwave = nextwave
                    root._prevwave = nextwave
                }
                nextwave._parent = parent

            } else {
                parent._child = nextwave
                nextwave._parent = parent
            }

            nextwave._level = parent? parent._level + 1: 0

            return nextwave
        }

        this.debugout = function() {
            var level = this._level + (this._indent == -1? -1: 0)
            var result = [_.string$(level, "\t") + this._name]

            // if (this._branches) {
            //     for (var i = 0; i < this._branches.length; i++) {
            //         var branch = this._branches[i]
            //         if (this[branch]) {
            //             result = result.concat(this[branch].debugout())
            //         }
            //     }
            // }

            if (this._child) { result = result.concat(this._child.debugout()) }

            if (this._nextwave) {  
                result = result.concat(this._nextwave.debugout())
            }

            return result
        }
    })

    _.define.wavenode("sleep", function(supermodel) {
        this._indent = 0
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

    _.define.wavenode("if", function(supermodel) {
        this._indent = 1
        this._name = "if"
        this._isblock = true
        this._isblockend = false

        this._branches = ["_condition", "_whentrue", "_whenfalse", "_end"]
        this._condition = null
        this._truewave = null
        this._falsewave = null
        this._endwave = null
        this._nextwave = null

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
        this._isblock = true
        this._isblockend = true

        this._indent = 1
        this._name = "else"

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
        this._indent = -1
        this._isblock = false
        this._isblockend = true

        this.construct = function() {}
    })

    _.define.wavenode("wave", function() {
        this._name = "wave"
        this._isblock = true
        this._indent = 0

        this._lastcreated = undefined

        this.then = function(nextwave) {
            if (!nextwave) { throw "Error: No wave provided" }

            if (_.isfunction(nextwave)) { nextwave = _.model.wavenode(nextwave) }
            
            if (!this._child) { 
                this._child = nextwave 
                nextwave._parent = this
                nextwave._level = 1
            } else {
                this._lastcreated.then(nextwave)
            }

            this._lastcreated = nextwave            
            return this
        }

        this.sleep = function(ms) {  
            return this.then(_.model.sleep(ms)) 
        }
        this.if = function(fn) { return this.then(_.model.if(fn)) }
//        this.elseif = function(fn) { this.end(); return this.then(_.model.elseif(fn)) }
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
        .if(function() { return true })
            .then(function() { return "Hello" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })
        // .else().if(function() { return false })
        //     .then(function() { return "Hello" })
        //     .then(function(value) { return value + " World" })
        //     .then(function(value) { return value + "!" })
        .else()
            .then(function() { return "Goodbye" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })    
        .end()

    _.console.write(wavetest.debugout().join("\n") + "\n")
})


 
        // this.getnext = function(current) {
        //     return this._next
        // }

        // this.next = function(source) {
        //     this._next = new _.model.wave(source).assign(this._parent)
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