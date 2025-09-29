_.define.kindex("vortex", function () {
    return {
        _worldid: null

        , makebehavior: _.behavior({
            create: function () {
                this._worldid = {}

                supermodel.create.apply(this, arguments)
                this.addworldid("local", "local")
            }
        })

        , fleetbehavior: _.behavior({
            enter: function (fleet) {
                _.world.ocean.arrive(fleet)
            }

            , exit: function (fleet) {
                var worldid = this.findworldid(fleet.destination)

                if (!worldid) { return fleet.error("unknown world") }

                if (worldid == "local") {
                    this.enter(fleet)
                } else {
                    //todo: .....
                }
            }
        })

        , worldbehavior: _.behavior({
            addworldid: function (key, worldid) {
                this._worldid[key] = worldid
            }

            , findworldid: function (key) {
                return this._worldid[key]
            }
        })
    }
})