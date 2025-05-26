//*************************************************************************************************
// model - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("model", function(_) {
    _.define.object("model", function (supermodel) {
        this._self = undefined

        this.self = function () {
            if (this.hasself()) { return this._self._self }
            return undefined
        }
        
        this.hasself = function() { return this._self? true: false }
    })
})