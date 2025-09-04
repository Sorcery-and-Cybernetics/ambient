//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("list", function(_) {
  _.define.object("list", function(supermodel) {
  // Properties
  this._nodes = null
  this.sortstyle = null // "order" or "name"
  this._keymap = null
  this._sortby = null
  this.uidmap = null
  this.sortlist = null

  // Methods (no code yet)
  this.add = function(item) {}
  this.del = function(item) {}
  this.get = function(key) {}
  this.has = function(key) {}

  this.first = function() {}
  this.last = function() {}

  this.count = function() {}
  this.sortby = function(key) {}
  this.getitem = function(position) {}
  this.getitembyuid = function(uid) {}
  this.clear = function() {}
  this.foreach = function(fn) {}
  this.findfirst = function(fieldname, search, comparison) {}
  this.onchange = _.signal()
  })
})
