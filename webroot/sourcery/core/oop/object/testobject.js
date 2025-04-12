_.ambient.module("testobject", function (_) {
    _.define.core.object("testobject", function(supermodel) {
        this._modelname = "testobject"
        this.modelname = function () { return this._modelname }
        this.construct = _.noop

        this.test = function() {
            _.debug("Test is working")
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

