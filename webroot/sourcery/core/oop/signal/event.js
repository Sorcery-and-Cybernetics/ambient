//*************************************************************************************************
// Event - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("event", function (_) {
    _.define.object("event", function () {
        this.name = "";
        this.source = null;
        this.cancelled = false;

        this.construct = function (source, name) {
            this.source = source;
            this.name = name;
        };

        this.cancel = function () {
            this.cancelled = true;
        };
    });
});