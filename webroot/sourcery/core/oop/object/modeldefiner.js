//*************************************************************************************************
// modeldefiner - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("modeldefiner", function (_) {
    var definer = function() {}
    var helper = _.helper.oop

    definerprototype = {
        babyname: "object"
        , babydef: undefined        
        , supermodelname: undefined

        , init: function (supermodelname, babyname, babydef) {
            this.babyname = babyname
            this.supermodelname = supermodelname
            this.babydef = babydef
            return this
        }        

        , make: function() {
            _.helper.oop.addmodel(this.babyname, this.supermodelname, this.babydef)
        }

        , extend: function(def) {
//            helper.overwritemodel("definer." + this.babyname, def)
            helper.overwritemodel(this.babyname, def)

            return this
        }
    }

    var modeldefiner = _.helper.oop.makemodel("modeldefiner", _.model.object, definerprototype)

    helper.addmodeldefiner("object", modeldefiner)
    helper.adddefiner("object")
 })