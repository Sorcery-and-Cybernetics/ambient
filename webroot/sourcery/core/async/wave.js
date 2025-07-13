//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("wave", function(_) {
    _.define.object("wave", function(supermodel) {
        this._name = "then"
        this._source = null   
        this._parent = null 
        this._child = null
        this._indent = 0
        this._level = 0
        this._prevwave = null
        this._nextwave = null
        this._orderindex = 1

        this.construct = function(source) {
            this._source = source
            this._prevwave = null
            this._nextwave = null
        }

        this.assign = function(parent) {
            nextwave._parent = parent
            if (!parent) { return this }

            //append after last child of this parent.
            if (parent._child) {               
                var first = parent._child

                if (!first._prevwave) {
                    first._nextwave = nextwave
                    first._prevwave = nextwave

                } else {
                    nextwave._prevwave = first._prevwave
                    nextwave._orderindex = nextwave._prevwave._orderindex + 1

                    first._prevwave._nextwave = nextwave
                    first._prevwave = nextwave
                }

            } else {
                parent._child = nextwave
            }

            nextwave._level = parent? parent._level + 1: 0            

            return this
        }

        this.then = function (source) {
            var nextwave = _.model.wave(source)
            var parent

            switch (this._indent) {
                case -1:
                    parent = this._parent._parent
                    break
                case 0:
                    parent = this._parent
                    break
                case 1:
                    parent = this
                    break
            }

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
        
        this.sleep = function (ms) {
            var wave = this.then(function (ms) {
                var current = this

                setTimeout(function () {
                    current.next()
                }, ms)

                current.pause()
            })
            wave._name = "sleep"

            return wave
        } 
        
        this.if = function(fn) {           
            var wave = this.then(function (fn) {
                var current = this 

                current.spawn(fn)
                    .ondone(function(value){
                        if (value) {
                            current.indent()
                        } else {
                            current.next()
                        }

                    })
            })

            wave._name = "if"
            wave._indent = 1

            return wave
        }

        this.elseif = function(fn) {
            var wave = this.endif()

            wave = wave.if(fn)
            wave._name = "elseif"

            return wave
        }

        this.else = function(fn) {
            var wave = this.endif()

            wave = wave.then()
            wave._indent = 1
            wave._name = "else"

            return wave
        }

        this.endif = function() {
            var wave = this.then()

            wave._indent = -1
            wave._name = "endif"

            return wave
        }

        this.debugout = function() {
            var level = this._level + (this._indent == -1? -1: 0)
            var result = [_.string$(level, "\t") + this._name]

            if (this._child) {
                result = result.concat(this._child.debugout())
            }

            if (this._nextwave) {  
                result = result.concat(this._nextwave.debugout())
            }

            return result
        }
 
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

        this.oncancel = _.model.basicsignal()
        this.cancel = function() { this.oncancel() }    
    })

    _.define.wave("wavehead", function() {
        this._indent = 1
        this._name = "wavehead"
    })

    _.wave = function() {
        return _.model.wavehead()
    }


}).ontest("wave", function(_) {
    var waveroot = _.wave()
    
    waveroot.sleep(1)
        .if(function() { return true })
            .then(function() { return "Hello" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })
        .elseif(function() { return false })
            .then(function() { return "Hello" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })
        .else()
            .then(function() { return "Goodbye" })
            .then(function(value) { return value + " World" })
            .then(function(value) { return value + "!" })    
        .endif()

    _.debug(waveroot.debugout().join("\n"))
})


