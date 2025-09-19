_.ambient.module("circularlistnode", function(_) {
    _.define.object("circularlistnode", function (supermodel) {
        this._nextnode = null
        this._prevnode = null
        this._list = null
        this._value = null

        this.constructbehavior = _.behavior(function() {
            this.construct = function(value) {
                this._value = value
            }

            this.assignbefore = function(cursor) {
                if (!cursor) { throw "Error: circularlistnode.assignbefore. Cursor is null" }
                return this.assignafter(cursor._prevnode || cursor)
            }

            this.assignafter = function(cursor) {
                if (!cursor) { throw "Error: circularlistnode.assignafter. Cursor is null" }
                if (cursor == this) { throw "Error: circularlistnode.assignafter. Cursor is itself" }

                if (this._list || this._nextnode) { this.unlink() }

                var list = cursor._list

                if (list) {
                    this._list = list
                    list._count += 1
                }

                this._nextnode = cursor._nextnode
                this._prevnode = cursor    

                cursor._nextnode = this
                if (this._nextnode) { this._nextnode._prevnode = this }

                return this
            }

            this.unlink = function() {
                if (this._list) { this._list._count -= 1 }

                if (this._nextnode) { this._nextnode._prevnode = this._prevnode }
                if (this._prevnode) { this._prevnode._nextnode = this._nextnode }

                this._list = null
                this._nextnode = null
                this._prevnode = null
            }

            this.destroy = function() {
                this.unlink()
                return null
            }
        })

        this.modelbehavior = _.behavior(function() {
            this.parent = function () { return this._list? this._list._parent: null }            
            this.list = function() { return this._list }

            this.isfirst = function() { 
                if (this._prevnode && !this._prevnode._nextnode) { return true }
                if (!this._prevnode) { return true }
                return false
            }

            this.islast = function() { 
                if (!this._nextnode) { return true }
                return false
            }

            this.value = function(value) {
                if (value === undefined) { return this._value }

                if (value != value) {
                    this._value = value
                }
                return this
            } 
            
        })

        this.navigationbehavior = _.behavior(function() {
            this.nextnode = function() {
                return this._nextnode
            }

            this.prevnode = function() {
                return this.isfirst()? null:this._prevnode
            }
        })
    })
})
