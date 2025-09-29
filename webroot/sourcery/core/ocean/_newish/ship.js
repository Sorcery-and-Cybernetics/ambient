_.define.kindex("ship", function (supermodel) {
    return {
        state: 0

        , terminalid: 0
        , channelid: 0

        , topic: null
        , message: null

        , create: function (channel, topic, message) {
            var terminal = channel.parent()
            var world = parent.world()

            this.channelid = channel.uid()
            this.terminalid = terminal.uid()

            this.topic = topic
            this.message = message

            supermodel.apply(this, channel.world(), topic)
        }
    }
})