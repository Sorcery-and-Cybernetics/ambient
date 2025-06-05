//*************************************************************************************************
// Event - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("event", function (_) {
    _.define.object("event", function () {
        this._name = "";
        this._source = undefined;
        this._cancelled = false;

        this.construct = function (source, name) {
            this._source = source;
            this._name = name;
        };

        this.name = function () {
            return this._name;
        };

        this.source = function () {
            return this._source;
        };

        this.cancelled = function () {
            return this._cancelled;
        };

        this.cancel = function () {
            this._cancelled = true;
        };
    });
});