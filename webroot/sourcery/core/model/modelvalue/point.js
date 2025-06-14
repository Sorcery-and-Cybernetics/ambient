//*****************************************************************************************************************
// rect - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

_.ambient.module("point", function(_) {
    _.define.modelvalue("point", function () {
        this.x = _.model.property(0)
        this.y = _.model.property(0)

        this.construct = function (x, y) {
            this.x(x || 0)
            this.y(y || 0)
        }
    })
})