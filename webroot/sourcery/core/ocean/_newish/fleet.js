_.define.kindex("fleet", function (supermodel) {
    return {
        _ship: null

        , retour: false
        , worldid: 0
        , landid: 0
        , harborid: 0
        , dockid: 0
        , terminalid: 0
        , channelid: 0

        , state: 0
        , statedescription: ""

        , create: function () {
            supermodel.apply(this, arguments)

            this._ship = _.make.stacklist(this)
        }

        , join: function (ship) {
            this._ship.push(ship)
        }

	    , leave: function (ship) {
	    }

	    , for: function (ship) { }

        , travel: function () {
        }
    }
})