//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("list", function(_) {
	_.define.object("list", function(supermodel) {
		this._nodes = null
		this._sortby = "name"

//		this.sortby = _.model.string("name")

		this.constructbehavior = _.behavior(function() {
			this.construct = function(sortby) {
				this._nodes = _.model.skiplistroot()

				if (sortby) { this._sortby = sortby }
				this._nodes.issortlist(true).sortby(sortby || "name")
			}
		})

		this.add = function(item, orderindex) {
			var node = _.model.skiplistnode(item)

			this._nodes.add(node, orderindex)
			return node
		}

		this.get = function(name, position) {
			var node = this.getnode(name, position)
			return node? node.value(): null
		}

		this.getnode = function(name, position) {
			var nodes

			if (!name) {
				node = this._nodes.nodebyindex(position || 0)

			} else if (!position) {
				node = this._nodes.findfirstnode(name)

			} else if (position > 0) {
				var node = this._nodes.findfirstnode(name)
				node = this._nodes.findrelativenode(node, position - 1)

			} else if (position < 0) {
				var node = this._nodes.findlastnode(name)
				node = this._nodes.findrelativenode(node, position + 1)
			}

			return node
		}

		this.remove = function(name, from, to) {
			if (!name) { throw "Error: list.remove: No name provided" }

			if (from == null) { 
				from = 1
				to = -1
			} else {
				if (to == null) { 
					to = from 
				}
			}

			var nodefrom = this.getnode(name, from)
			var nodeto = this.getnode(name, to)			

			var indexfrom = nodefrom.orderindex()
			var indexto = nodeto.orderindex()

			if (indexto < indexfrom) { throw "Error: list.remove: Invalid range" }

			var node = nodefrom

			while (node) {
				var nextnode = node.nextnode()
				node.destroy()

				if (node == nodeto) { break }
				node = nextnode
			} 

			return this
		}

		this.count = function() { return this._nodes? this._nodes() : 0 }

		this.clear = function() {
			if (this._nodes) {
				while (this._nodes.count()) {
					var node = this._nodes.nodebyindex(1)
					if (node) { node.remove() }
				}
			}
		}

		this.for = function(name, from, to, fn) {
			var node = this.getnode(name, from)
			var endnode = this.getnode(name, to)

			var indexfrom = nodefrom.orderindex()
			var indexto = nodeto.orderindex()

			if (indexto < indexfrom) { throw "Error: list.remove: Invalid range" }			

			while (node && node != endnode) {
				fn(node.value())
				node = node.nextnode()
			}
			return this
		}

		this.foreach = function(fn) {
			this._nodes.foreach(function(node) {
				fn(node.value())
			})
			return this
		}

        this.debugbehavior = _.behavior(function() {
            this.debugout = function () {
				var result = []

				this.foreach(function(item) {
					result.push(item.debugout())
				})
				return result.join(", ")
			}
		})


		this.onchange = _.model.signal()
		this.onchildchange = _.model.signal()
	})
})
