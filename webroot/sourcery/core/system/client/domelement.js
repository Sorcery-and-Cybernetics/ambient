//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md – Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("domelement", function(_) {
    _.define.object("domelement", function(supermodel) {
        this.element = null

        this.construct = function(element) {
            this.element = element || null
        }

        this.getid = function() {
            if (!this.element) { return null }
            return this.element.id
        }

        this.getclass = function() {
            if (!this.element) { return null }
            return this.element.className
        }

        this.gettag = function() {
            if (!this.element) { return null }
            return this.element.tagName.toLowerCase()
        }

        this.gettext = function() {
            if (!this.element) { return null }
            return this.element.textContent
        }

        this.settext = function(text) {
            if (!this.element) { return this }
            this.element.textContent = text
            return this
        }

        this.show = function() {
            if (!this.element) { return this }
            this.element.style.display = ""
            return this
        }

        this.hide = function() {
            if (!this.element) { return this }
            this.element.style.display = "none"
            return this
        }

        this.addclass = function(classname) {
            if (!this.element) { return this }
            if (this.element.classList) {
                this.element.classList.add(classname)
            } else {
                var classes = this.element.className.split(" ")
                if (classes.indexOf(classname) < 0) { classes.push(classname) }
                this.element.className = classes.join(" ")
            }
            return this
        }

        this.removeclass = function(classname) {
            if (!this.element) { return this }
            if (this.element.classList) {
                this.element.classList.remove(classname)
            } else {
                var classes = this.element.className.split(" ")
                var idx = classes.indexOf(classname)
                if (idx >= 0) { classes.splice(idx, 1) }
                this.element.className = classes.join(" ")
            }
            return this
        }

        this.hasclass = function(classname) {
            if (!this.element) { return false }
            if (this.element.classList) {
                return this.element.classList.contains(classname)
            } else {
                var classes = this.element.className.split(" ")
                return classes.indexOf(classname) >= 0
            }
        }

        this.on = function(event, handler) {
            if (!this.element) { return this }
            this.element.addEventListener(event, handler)
            return this
        }

        this.off = function(event, handler) {
            if (!this.element) { return this }
            this.element.removeEventListener(event, handler)
            return this
        }
    })
})
