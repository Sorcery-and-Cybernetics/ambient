//*************************************************************************************************
// skiplistcursor - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistcursor", function (_) {
    
    _.define.core.object("core.skiplistcursor", function (supermodel) {
        this._list = null;
        this._current = null;

        this.constructbehavior = _.behavior(function() {
            this.construct = function(list) {
                this._list = list;
            };
        });

        this.navigationbehavior = _.behavior(function() {
            this.eof = function() { 
                return !(this._current && !this._current._isroot); 
            };
        });
    });
});
