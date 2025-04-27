//*************************************************************************************************
// globalobject - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("globalobject", function (_) {
    _.define.core.object("core.globalobject")
        .extend(function(definer) {
            this.make = function() {
                _.helper.oop.addmodel(this.babyname, this.supermodelname, this.babydef)
                _[this.babyname] = _.make[this.babyname](_)
            }            
        })
})