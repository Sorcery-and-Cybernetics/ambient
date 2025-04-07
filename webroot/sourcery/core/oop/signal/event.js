//*************************************************************************************************
// Event - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("event", function (_) {
    _.define.core.object("core.event", function () {
        this.name = "";
        this.source = null;
        this.cancelled = false;

        this.initialize = function (source, name) {
            this.source = source;
            this.name = name;
        };

        this.cancel = function () {
            this.cancelled = true;
        };
    });
});