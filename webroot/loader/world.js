//*************************************************************************************************
// world - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("world", function () {
        return {
            system: null
            , name: null
            
            , construct: function (system, name) {
                this.system = system
                this.name = name
            }
        }
    })
}) (_.ambient)