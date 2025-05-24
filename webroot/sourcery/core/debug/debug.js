//*************************************************************************************************
// debug - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("debug", function (_) {

    _.eqnull = function (obj, funcname) {
        var eqnull = false

        if (obj == null) {
            eqnull = true

        } else if (obj.exists) {
            eqnull = !obj.exists()
        }

        if (eqnull && funcname && _.system && _.system.warn) {
            _.system.warn("eqnull", funcname, undefined, "object is missing")
        }
        return eqnull
    }

    _.exists = function (obj, funcname) {
        return !_.eqnull(obj, funcname)
    }

    _.ensure = function (obj, funcname) {
        return _.eqnull(obj, funcname) ? undefined : obj
    }

})