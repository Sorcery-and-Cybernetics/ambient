//*****************************************************************************************************************
// wavehead - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

_.ambient.module("wavehead", function(_) {
    _.define.object("wavehead", function(supermodel) {        
        
        this.start = function(value) {
            const current = _.model.current()
            current.value(value)            
            this.run(current)
            return current
        }
    })
})