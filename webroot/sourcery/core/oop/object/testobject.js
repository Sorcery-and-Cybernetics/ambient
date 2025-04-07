_.ambient.module("testobject", function (_) {
    _.define.core.object("testobject", function(supermodel) {
        return {
            _modelname: "testobject"
            , modelname: function () { return this._modelname }
            , initialize: _.noop

            , test: function() {
                _.debug("Test is working")
            }
        }             
    })
//     .extend(function(definer) {
//         return {
//             make: function() {
//                _.helper.oop.addmodel(this.modelname, this.supermodelname, this.modeldef)
//             }
//         }
//     })
})
.onload(function(_) {
    _.debug("Moo " + _.name)

    var test = _.make.testobject()
    test.test()
})  

