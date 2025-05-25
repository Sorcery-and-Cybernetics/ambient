//*************************************************************************************************
// selfnode - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("selfnode", function(_) {
    _.define.object("selfnode", function (supermodel) {
        this._as = undefined
        this._self = undefined

        this.construct = function (as, self) {
            this._as = as
            this._self = self
        }

        this.as = function () {
            return this._as
        }

        this.self = function () {
            return this._self
        }

        this.value = function () {
            return this._self.value()
        }
    })
})