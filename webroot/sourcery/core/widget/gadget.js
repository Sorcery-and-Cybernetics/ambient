_.ambient.module("gadget", function(_) {
    _.define.widget("gadget", function (supermodel) {
        this.child = _.model.list()

        this.objectbehavior = _.behavior(function() {
            this.text = _.model.widgetstyle()

            this.assignto = function(parent, orderindex, relative) {
                parent.assign(this, orderindex, relative)
                this._parent = parent
                return this
            }

            this.assign = function(widget, orderindex, relative) {
                this.child.add(widget, orderindex, relative)

                this.setdirty()
                this._phase = this.phases.assign
                return this
            }

            this.delchild = function(widget) {
                widget.destroy()
            }              
        })
        
        this.renderbehavior = _.behavior(function() {
            this.render = function(force, resizing) {
                var me = this

                if (this.isdestroy()) { return this }

                var dirty = this.dirty
                force = force || !!(this.dirty & 2)

                if (this.widgetstate < this.phases.show) {
                    this.show()
                }  
                
                this._domcreate()
                this.phase = this.phases.render

                this.dirty = 0

                var maxwidth = 0
                var maxheight = 0

                if (this.onrender) {this.onrender() }
                // if (this.onlayout) { this.onlayout() }
                // if (this.onskin) { this.onskin() }

                if (this._child) {
                    this._child.foreach(function (child) {
                        if (child.dirty || force) {
                            child.render(force, resizing)
                        } else if (resizing) {
                            var childstyle = child.style()

                            if ((childstyle.right() != null) || (childstyle.bottom() != null)) {
                                child.render(undefined, resizing)
                            }
                        }
                    })
                }

                this.phase = this.phases.show

                return this
            }
        })
        
    })
})