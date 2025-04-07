//*************************************************************************************************
// Event - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("event", function (_) {
    _.define.core.object("core.event", function () {
        return {
            name: ""
            , source: null
            , cancelled: false

            , initialize: function (source, name) {
                this.source = source
                this.name = name
            }

            , cancel: function () {
                this.cancelled = true
            }
        }
    })
})
