_.define.kindex("land", function (supermodel) {
    return {
        makebehavior: _.behavior({
            create: function () {
                supermodel.create.apply(this, arguments)

                this._harbor = {}
            }
        })

        , authbehavior: _.behavior({
            _username: ""
            , _password: ""

            , setgate: function (username, password) {
                this._username = username
                this._password = password
                return this
            }

            , username: function () {
                return this._username
            }

            , password: function () {
                return this._password
            }
        })

        , shippingbehavior: _.behavior({
            arrive: function (fleet) {
                var harbor = this.harbor(fleet.harbor)

                if (harbor) {
                    harbor.arrive(fleet)
                } else {
                    //refactormarker:
                }
            }

            , depart: function (fleet) {
                //refactormarker:
            }
        })

        , harborbehavior: _.behavior({
            _harbor: null

            , harbor: function (key) {
                var harbor = this._harbor[key]

                if (!harbor && key) {
                    this.addharbor(key)
                }

                return harbor
            }

            , addharbor: function (key, harbor) {
                var def = _.make.harbor()
                if (!def) { throw "error" }

                if (!harbor) {
                    var harbor = def(this, key)
                }

                if (!(harbor instanceof _.kind.harbor)) {
                    throw "error: harbor expected"
                }

                this._harbor[key] = harbor
                return harbor
            }

            , removeharbor: function (harbor) {
                if (harbor.exists()) {
                    return harbor.destroy()
                }

                delete this.harbor[harbor.key()]
            }

        })

    }
})