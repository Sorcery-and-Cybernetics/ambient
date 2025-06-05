//*************************************************************************************************
// defextender - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("defextender", function (_) {
    _.define.object("defextender", function(supermodel) {
        this.definetrait = function (modeldef, traitname) { }

        this.iscompatible = function (superdef) { return (this._modelname == superdef._modelname) } 

        this.inherit = function (superdef) {
            for (var traitname in superdef) {
                var traitvalue = this[traitname]

                if (!_.isfunction(traitvalue) && this.hasOwnProperty(traitname)) {
                    switch (traitname) {
                        case "_modelname":
                        case "_parent":
                        case "_definition":
                        case "_name":
                            break
                        default:
                            var supervalue = superdef[traitname]

                            if (traitvalue === undefined && supervalue !== undefined) {
                                this[traitname] = supervalue
                            }
                    }                    
                }
            }
        }
    })
})