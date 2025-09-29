//clientside httpship


_.sailship = function (ship) {
    
}


_.define.ship("httpship", function (supermodel) {
    return {
        connectionerror: ""
        , sail: function () {
            var me = this

            _.system.httpshipcount++

            _.http.post(_.config.basepath.productpath + "ocean", null, me.json(), function (err, data) {
                _.system.httpshipcount--

                if (err) {
                    me.connectionerror = err
                    me.retour = true
                    _.ocean.sail(me)
                } else {
                    data = JSON.parse(data)
                    me.json(data)
                    _.ocean.sail(me)
                }
            })
        }
    }
})
