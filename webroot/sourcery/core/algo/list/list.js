//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("list", function(_) {
  _.define.object("list", function(supermodel) {
    this._nodes = null

    this.ordered = _.model.boolean(false)

    this.constructbehavior = _.behavior(function() {
        this.construct = function() {
        }

        
    })

    
    this.add = function(item, position, relative) {}
    this.get = function(name, position) {}
    this.remove = function(name, from, to) {}
    this.count = function(name) { return (this._nodes? this._nodes.count(name): 0) }
    this.clear = function() {}
    this.for = function (name, from, to, fn) { }
    this.foreach = function(fn) {}

    this.onchange = _.signal()
    this.onchildchange = _.signal()
  })
})
