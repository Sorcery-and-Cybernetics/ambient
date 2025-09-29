_.define.kind("world", function (supermodel) {
    return {
        land: null
        , ocean: null

        , create: function (name) {
            this._name = name
            this._password = password

            this.land = _.make.land(this, "land")
            this.ocean = _.make.ocean(this, "ocean")
        }

        , name: function () {
            return this._name
        }

        , uidbehavior: _.behavior({
            _lastlocaluid: 0
            , _lastglobaluid: 0

            , makelocaluid: function (uid) {
                if (!uid) {
                    uid = this._lastlocaluid + 1
                    this._lastlocaluid = uid

                } else {
                    uid = _.cint(uid)
                    if (uid > this._lastlocaluid) { this._lastlocaluid = uid }
                }

                return uid
            }

            , makeglobaluid: function (uid) {
                if (!uid) {
                    uid = this._lastglobaluid + 1
                    this._lastglobaluid = uid

                } else {
                    uid = _.cint(uid)
                    if (uid > this._lastglobaluid) { this._lastglobaluid = uid }
                }

                return uid
            }
        })

    }
})