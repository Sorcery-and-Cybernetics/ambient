_.define.kindex("terminal", function (supermodel) {
    return {
        _ismain: false

        , _channel: null

        , fleetbehavior: _.behavior({
            sendcargo: function (channel, topic, message) {
                _.make.ship(this._world, topic, message)
            }
        })

        , channelbehavior: _.behavior({
            channel: function (name) {
                var channel = this._channel[name]

                if (!channel && name) {
                    this.addchannel(name)
                }

                return channel
            }

            , addchannel: function (key, channel) {
                var def = _.make.channel()
                if (!def) { throw "error" }

                if (!channel) {
                    var def = _.make[key]

                    if (!def) { throw "error" }
                    if (!(def instanceof _.kind.channel)) { throw "error" }

                    channel = def(this, key)
                }

                if (!(channel instanceof _.kind.channel)) {
                    throw "error: channel expected"
                }

                this._channel[key] = channel
                return channel
            }

            , removechannel: function (channel) {
                if (channel.exists()) {
                    return channel.destroy()
                }

                delete this.channel[channel.key()]
            }
        })

    }
})