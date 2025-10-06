_.define.control("widget", function (supermodel) {
    return {
        //        , data: _.embed("paginatordata")
        //_data: null
        //, data: function (value) {
        //    if (value === undefined) {
        //        var item = this._data

        //        if (!item) {
        //            item = _.make.paginatordata()
        //            item._parent = this
        //            this._data = item
        //        }
        //        return item
        //    }

        //    if (this._data) { this._data = this._data.destroy() }
        //    this._data = value

        //    if (!value._parent) { value._parent = this }
        //}

        dataembed: null

        , _refuid: null
        , refuid: function (value) {
            if (value === undefined) {
                if (this._refuid) { return this._refuid }

                var data = this.data()
                if (data && data.uid) { return data.uid() }
                return 0
            }

            this._refuid = value
            return this
        }

        , data: function (value) {
            var self = this.self()

            if (value === undefined) {
                if (!self && this.dataembed) {
                    self = _.make[this.dataembed]()
                    self._parent = this
                    this.self(self)
                }
                return self
            }

            if (self) { self.destroy() }

            if (!value._parent) { value._parent = this }
            this.self(value)

            return this
        }
    }
})
