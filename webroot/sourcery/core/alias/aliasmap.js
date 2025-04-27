//*************************************************************************************************
// aliasmap - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("map", function(_) { 
    _.define.core.map("alias.map", function (supermodel) {
        this.del = function (key) {
            if (key == null) { throw "alias.map.del: key is null"; }

            var value = this._value[key]
            if (_.isalias(value)) { value.destroy() }
            delete this._value[key];
        };        
    })
})