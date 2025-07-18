//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("map", function(_) {
    _.define.object("map", function (supermodel) {
        this._value = null

        this.construct = function () {
            this._value = {}
        }

        this.get = function (key) {
            if (key == null) { throw "Map.get: key is null" }
            return this._value[key]
        }

        this.set = function (key, value) {
            if (key == null) { throw "Map.set: key is null" }

            this._value[key] = value
            return this
        }

        this.has = function (key) {
            if (key == null) { throw "Map.has: key is null" }
            return (this._value[key] != null)
        }

        this.del = function (key) {
            if (key == null) { throw "Map.del: key is null" }
            delete this._value[key]
        }

        this.foreach = function (next) {
            var me = this

            for (var key in this._value) {
                var result = next(this._value[key], key)

                switch (result) {
                    case _.done:
                        return

                    case _.remove:
                        me.del(key)
                        break
                }
            }
        }

        this.clear = function () {
            var me = this

            for (var key in this._value) {
                me.del(key)
            }
        }

        this.length = function () {
            var count = 0

            for (var key in this._value) {
                count++
            }
            return count
        }

        this.destroy = function () {
            this.clear()
            supermodel.destroy.call(this)
        }

        this.keys = function () {
            var result = []

            this.foreach(function (value, key) {
                result.push(key)
            })
            return result
        }

        this.values = function () {
            var result = []

            this.foreach(function (value, key) {
                result.push(value)
            })
            return result
        }

        this.tojson = function () {
            var result = {}

            this.foreach(function (value, key) {
                result[key] = value
            })
            return result
        }

        this.fromjson = function (data) {
            var me = this

            _.foreach(data, function (value, key) {
                me.set(key, value)
            })
        }

        this.debugbehavior = function() {
            this.debugout = function () {
                _.debug(this.tojson())
            }
        }
    })
})
.ontest("map", function(_) {
    var map = _.model.map()

    map.set("a", 1)
    map.set("b", 2)
    map.set("c", 3)

    map.fromjson({ "d": 4, "e": 5} )

    this.assert(map.keys(), ["a", "b", "c", "d", "e"], "map.keys()")
    this.assert(map.values(), [1, 2, 3, 4, 5], "map.values()")
    this.assert(map.length(), 5, "map.length()")
    this.assert(map.tojson(), { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 }, "map.tojson()")
    this.assert(map.has("d"), true, "map.has()")

    this.assert(map.get("d"), 4, "map.get()")

    map.del("d")

    this.assert(map.length(), 4, "map.length()")
    this.assert(map.get("d"), undefined, "map.get()")
    this.assert(map.has("d"), false, "map.has()")
    this.assert(map.tojson(), { "a": 1, "b": 2, "c": 3, "e": 5 }, "map.tojson()")

    map.clear()
    this.assert(map.length(), 0, "map.length()")
    this.assert(map.tojson(), {}, "map.tojson()")
})