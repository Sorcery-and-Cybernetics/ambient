_.define.kind("barrel", {
    id: 0
    , pipeid: 0
    , data: null
    , progress: 0

    , _onclose: null
    , _onerror: null

    , create: function (pipeid, id) {
        this.pipeid = pipeid
        this.id = id
        this.progress = 0
    }

    , json: function (value) {
        if (!value) {
            return {
                id: this.id || 0
                , pipeid: this.pipeid
                , data: this.data
                , progress: this.progress
            }
        }

        this.id = value.id || 0
        this.pipeid = value.pipeid
        this.data = value.data
        this.progress = value.progress

        return this
    }

    , error: function (errormessage) {
        this.progress = -1
        this.errormessage = errormessage
        this.close(errormessage)
    }

    , close: function (data) {
        this.fill(data)
        this.onclose()
    }

    , fill: function (data) {
        //todo: calculate progress?

        //if (this._evolution <= _.enum.evolution.none) { return this.error("Cannot write. Object is not ready") }
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
                this.data = [this.data]

            case _.vtarray:
                //todo: cannot send byte data
                switch (datatype) {
                    case _.vtobject:
                    case _.vtarray:
                        this.data.push(data)
                        break

                    default:
                        return this.error("Wrong type added to buffer")
                }

            default:
                this.data += _.cstr(data)
        }

        return this
    }

    , onclose: function (fn) {
        if (!fn) {
            if (this._onclose) {
                this._onclose.call(this, this.data)
            }
            this.destroy()

        } else {
            this._onclose = fn
            if (this._evolution < 0) {
                this._onclose.call(this, this.data)
            }
        }
        return this
    }
})
