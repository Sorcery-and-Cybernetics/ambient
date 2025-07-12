//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("modeldefiner", function (_) {
    var definer = function() {}
    var helper = _.helper.oop

    definerprototype = {
        babyname: "object"
        , babydef: null        
        , supermodelname: null

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