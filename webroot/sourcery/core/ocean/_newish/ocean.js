_.define.kindex("ocean", function (supermodel) {
    return {

        makebehavior: _.behavior({
            create: function () {
                supermodel.create.apply(this, arguments)

                this._fleet = {}
            }
        })

        , fleetbehavior: _.behavior({
            _fleet: null

            , arrive: function (fleet) {
                this._fleet[fleet.dockid](fleet)

                this.world().land().arrive(fleet)
            }

            , findfleet: function (terminalid) {
                var fleet = this._fleet[terminalid]

                if (!fleet) {
                    fleet = this.makefleet(this, terminalid)
                    this._fleet[terminalid]
                }
            }

            , makefleet: function (terminalid) {
                return _.make.fleet(this, terminalid)
            }

            , depart: function (fleet) {
            }
        })
    }
})