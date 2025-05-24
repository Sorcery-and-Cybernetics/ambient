//*************************************************************************************************
// skiplistcursor - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistcursor", function (_) {
    
    _.define.object("skiplistcursor", function (supermodel) {
        this._list = undefined
        this._current = undefined

        this.constructbehavior = _.behavior(function() {
            this.construct = function(list) {
                this._list = list
            }
        })

        this.navigationbehavior = _.behavior(function() {
            this.eof = function() { 
                return !(this._current && !this._current._isroot)
            };
        });
    });
});
