_.define.kindex("dock", function (supermodel) {
    return {
        _terminal: null
        , _fleet: null
        , _ismain: false

        , makebehavior: _.behavior({
            create: function (parent, key, value, uid) {
                this._terminal = {}
                this._fleet = _.make.stacklist(this)

                if (key == "main") { this._ismain = true }

                supermodel.create.apply(this, arguments)
            }

            , ismain: function () {
                return !!this._ismain
            }
        })

        , fleetbehavior: _.behavior({
            arrive: function (fleet) {
                var me = this

                fleet.foreachship(function (ship) {
                    if (ship.terminal) {
                        var terminal = me.findterminal()
                    }
                    var terminal = me.terminal(ship.terminal)

                    if (terminal) {
                        terminal.arrive(ship)
                    } else {
                        //refactormarker:
                    }
                })
            }
        })

        , terminalbehavior: _.behavior({
            terminal: function (name) {
                var terminal = this._terminal[name]

                if (!terminal && name) {
                    this.addterminal(name)
                }

                return terminal
            }

            , addterminal: function (key, terminal) {
                var def = _.make.terminal()
                if (!def) { throw "error" }

                if (!terminal) {
                    var terminal = def(this, key)
                }

                if (!(terminal instanceof _.kind.terminal)) {
                    throw "error: terminal expected"
                }

                this._terminal[key] = terminal
                return terminal
            }

            , removeterminal: function (terminal) {
                if (terminal.exists()) {
                    return terminal.destroy()
                }

                delete this.terminal[terminal.key()]
            }
        })
    }
})