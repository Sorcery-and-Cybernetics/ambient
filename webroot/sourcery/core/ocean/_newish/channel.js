_.define.kindex("channel", function (supermodel) {
    return {
        isghost: false

        , send: function (topic, message) {
            var parent = this.parent()

            if (!parent) { throw "error" }

            parent.sendcargo(this, topic, message)
        }

//        , receivecargo: _.signal()
        , onreceive: function (topic, message) {
                        
        }
    }
})