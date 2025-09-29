//todo: this.checksessiontoken(ship) -> check if session exists
//todo: On client copy sessionid to dock on return
//todo: client sends jwt if there isn't a sessiontoken
//todo: client needs to know when to retry or not. Based on sessiontoken.

_.define.kind("harbormaster", function (supermodel) {
    var makedock = function (me, ship, dockid) {

        var dock = _.make.dock(me.harbor, ship.dockid)
        dock.sessiontoken = ship.sessiontoken
        dock.globals = _.clone(me.harbor.globals || {})
        dock.actions = me.harbor.actions

        if (_.docklogger) {
            var personuid = ship.personuid||0
            _.docklogger.writeline("create: " + _.make.date().setnow().format$("yyyy-mm-dd hh:nn:ss:iii") + " - " + me.harbor.name + " - " + dock.name + " - " + personuid)
        }
        return dock
    }

    return {
        name: ""
        , harbor: null

        , anomname: null
        , anompass: null

        , create: function (harbor) {
            this.harbor = harbor
            this.name = harbor.name
        }

        , finddock: function (ship) {
            var dockid

            if (ship.sessiontoken) {
                dockid = this.checksessiontoken(ship)

            } else if (ship.sacgoat) {
                dockid = this.checksacgoat(ship)

            } else if (ship.username) {
                dockid = this.checkcredentials(ship)

            } else {
                dockid = 0
                ship.sessiontoken = 0
            }

            if (!dockid) {
                return null
            }

            if (!ship.sessiontoken) {
                ship.sessiontoken = _.crypto.createsessionid()
            }

            return this.harbor.dock(dockid) || makedock(this, ship, dockid)
        }

        , setanomcredentials: function (anomname, anompass) {
            this.anomname = anomname
            this.anompass = anompass
        }

        , checkcredentials: function (ship) {
            if ((ship.username == this.anomname) && (!this.anompass || (ship.userpass == this.anompass))) {
                return ship.dockid
            } else {
                return 0
            }
        }

        , checksacgoat: function (ship) {
            if (_.jwt.verify(ship.sacgoat, null, _.config.auth.secret)) {
                var jsontoken = _.jwt.decode(ship.sacgoat)

                var expires = _.make.date().value(jsontoken.payload.exp)

                if (expires.isbefore(_.now())) { return 0 }
                if (!jsontoken.payload.personuid) { return 0 }

                ship.personuid = jsontoken.payload.personuid
                var dockid = ship.personuid

                var dock = this.harbor.dock(dockid)

                if (dock) {
                    ship.sessiontoken = dock.sessiontoken
                }

                return dockid

            } else {
                return 0
            }
        }

        , checksessiontoken: function (ship) {
            var dock = this.harbor.dock(ship.dockid)
            if (!dock) { return 0 }
            if (dock.sessiontoken != ship.sessiontoken) { return 0 }

            return ship.dockid
        }
        , ondock: _.signal()
    }
})

