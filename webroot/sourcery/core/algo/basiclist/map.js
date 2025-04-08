//*************************************************************************************************
// map - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("map", function(_) { 
    _.define.core.object("core.map", function (supermodel) {
        this._parent = null;
        this._key = "";
        this._value = null;

        this.initialize = function (parent, name) {
            this._value = {};
        };

        this.assign = function (parent, name) {
            this._parent = parent;
            this._name = name;
            this._value = {};
        };

        this.name = function () { return this._name; };

        this.get = function (key) {
            if (key == null) { throw "Map.get: key is null"; }
            return this._value[key];
        };

        this.set = function (key, value) {
            if (key == null) { throw "Map.set: key is null"; }

            this._value[key] = value;
            return this;
        };

        this.has = function (key) {
            if (key == null) { throw "Map.has: key is null"; }
            return (this._value[key] !== undefined);
        };

        this.del = function (key) {
            if (key == null) { throw "Map.del: key is null"; }
            delete this._value[key];
        };

        this.foreach = function (next) {
            var me = this;

            for (var key in this._value) {
                var result = next(this._value[key], key);

                switch (result) {
                    case _.done:
                        return;

                    case _.remove:
                        me.del(key);
                        break;
                }
            }
        };

        this.clear = function () {
            var me = this;

            for (var key in this._value) {
                me.del(key);
            }
        };

        this.length = function () {                
            var count = 0;

            for (var key in this._value) {
                count++;
            }
            return count;
        };

        this.destroy = function () {
            this.clear();
            supermodel.destroy.call(this);
        };
        
        this.keys = function () {
            var result = [];
            
            this.foreach(function (value, key) {
                result.push(key);
            });
            return result;
        };
        
        this.values = function () {
            var result = [];
            
            this.foreach(function (value, key) {
                result.push(value);
            });
            return result;
        };

        this.tojson = function () {
            var result = {};
            
            this.foreach(function (value, key) {
                result[key] = value;
            });
            return result;                
        };
        
        this.fromjson = function (data) {
            var me = this;

            _.foreach(data, function (value, key) {
                me.set(key, value);
            });
        };

        this.debugbehavior = function() {
            this.debugout = function () {
                _.debug(this.tojson());
            };
        };
    });
})
.onload(function(_) {
    //write tests for map
    _.debug.assertstart("map")
    
    var map = _.make.core.map()
    map.set("a", 1)
    map.set("b", 2)
    map.set("c", 3)

    map.fromjson({ "d": 4, "e": 5} )

    _.debug.assert(map.keys(), ["a", "b", "c", "d", "e"], "map.keys()")
    _.debug.assert(map.values(), [1, 2, 3, 4, 5], "map.values()")
    _.debug.assert(map.length(), 5, "map.length()")
    _.debug.assert(map.tojson(), { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 }, "map.tojson()")
    _.debug.assert(map.has("d"), true, "map.has()")

    _.debug.assert(map.get("d"), 4, "map.get()")

    map.del("d")

    _.debug(map.tojson())
    _.debug.assert(map.length(), 4, "map.length()")
    _.debug.assert(map.get("d"), undefined, "map.get()")
    _.debug.assert(map.has("d"), false, "map.has()")
    _.debug.assert(map.tojson(), { "a": 1, "b": 2, "c": 3, "e": 5 }, "map.tojson()")

    map.clear()
    _.debug.assert(map.length(), 0, "map.length()")
    _.debug.assert(map.tojson(), {}, "map.tojson()")

    return _.debug.assertfinish()
})