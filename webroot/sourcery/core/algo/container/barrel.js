//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

// todo: When phase is implemented correctly, see if we can use that instead of keeping track of state by hand.
// todo: improve fill

_.ambient.module("barrel", function(_) {

    _.define.object("barrel", function(supermodel) {
        this.id = 0
        this.pipeid = 0
        this.data = null
        this.progress = 0
        this.error = ""

        this._onclose = null
        this._onerror = null
        this._closed = false
        this._failed = false

        this.create = function(id, pipe) {
            this.id = id || 0
            this.pipeid = pipeid || 0
        }

        this.json = function(value) {
            if (!value) {
                var result = { id: this.id }

                if (this.data) { result.data = this.data }
                if (this.progress) { result.progress = this.progress }
                if (this.error) { result.error = this.error }
                if (this._closed) { result.closed = true }

                return result
            }

            this.id = value.id
            if (value.pipeid) {this.pipeid = value.pipeid }
            if (value.data) { this.data = value.data }
            if (value.progress) { this.progress = value.progress }
            if (value.error) { this.error = value.error }
            if (value.closed) { this._closed = true }

            return this
        }

        this.fill = function(data) {
            if (this._closed) { throw "Error: Barrel already is closed" }

            var buffertype = _.vartype(this.data)
            var datatype = _.vartype(data)

            switch (buffertype) {
                case _.vtnull:
                    switch (datatype) {
                        case _.vtobject:
                        case _.vtarray:
                            this.data = data
                            break
                        default:
                            this.data = _.cstr(data)
                    }
                    break

                case _.vtobject:
                    // todo: support object conversion or reject objects entirely
                    throw "Error: Not implemented"
                    this.data = [this.data]

                case _.vtarray:
                    // todo: support object-to-array conversion or reject objects entirely
                    throw "Error: Not implemented"

                    switch (datatype) {
                        case _.vtobject:
                            throw "Error: Invalid data type. Array expected"

                        case _.vtarray:
                            this.data = this.data.concat(data)

                            break
                        default:
                            return this.fail("wrong type added to buffer")
                    }

                case _.vtstring:
                    this.data += _.cstr(data)
                    break

                default:
                    throw "Error: Not implemented"
            }

            return this
        }

        this.fail = function(message) {
            if (this._failed) { return }

            this.error = message || true         
            this._failed = true

            this.onerror()
            this.close()
        }        

        this.close = function(data) {
            if (this._closed) { return }

            if (data) { this.fill(data) }
            this._closed = true

            this.onclose()
        }

        this.iserror = function() { return this._failed }
        this.isclose = function() { return this._closed }

        this.onclose = _.model.basicsignal()
        this.onerror = _.model.basicsignal()
    })

})
