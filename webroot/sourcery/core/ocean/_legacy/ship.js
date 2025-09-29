_.define.aliaskind("ship", {
    destination: ""
    , home: ""
    , retour: false
    , cargo: null
    , sessiontoken: null
    , username: null
    , userpass: null
    , sacgoat: ""

    , err: ""

    , create: function (home, destination) {
        this.home = home
        this.destination = destination
    }

    , initialize: function (home, destination) {
        this.home = home
        this.destination = destination

        return this
    }

    , loadcargo: function (barrels) {
        this.cargo = barrels
    }

    , unloadcargo: function (next) {
        if (!this.cargo) { return }

        for (var index = 0; index < this.cargo.length; index++) {
            var barrel = this.cargo[index]
            next(barrel)
        }

        this.cargo = null
    }

    , retakecargo: function (next) {
        if (!this.cargo) { return }

        for (var index = this.cargo.length - 1; index >= 0; index--) {
            var barrel = this.cargo[index]
            next(barrel)
        }

        this.cargo = null
    }

    , hascargo: function () {
        return !!(this.cargo && this.cargo.length)
    }

    , json: function (data) {
        if (!data) {
            var cargodata = []

            _.foreach(this.cargo, function (barrel) {
                cargodata.push(barrel.json())
            })

            var result = {
                home: this.home
                , destination: this.destination
                , retour: this.retour
                , dockid: this.dockid
                , cargo: cargodata
            }

            if (this.err) { result.err = this.err }

            if (this.sessiontoken) {
                result.sessiontoken = this.sessiontoken
            } else if (this.sacgoat) {
                result.sacgoat = this.sacgoat
            } else {
                result.username = this.username
                result.userpass = this.userpass
            }
            return result
        }

        var me = this

        me.home = data.home
        me.retour = data.retour
        me.destination = data.destination
        me.dockid = data.dockid || null
        me.err = data.err || null

        me.sessiontoken = data.sessiontoken || null
        me.sacgoat = data.sacgoat || null
        me.username = data.username || null
        me.userpass = data.userpass || null

        me.cargo = []

        _.foreach(data.cargo, function (barreldata) {
            var barrel = _.make.barrel()
                .json(barreldata)

            me.cargo.push(barrel)
        })

        return this
    }

    , sail: function () {
        _.ocean.sail(this)
    }

    , error: function (message) {
        if (this.retour) { throw "error" }

        this.err = message
        this.retour = true

        this.sail()
    }

    , ondestroy: function () {
        this.cargo = null
    }

})

