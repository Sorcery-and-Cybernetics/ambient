_.ambient.module("testobject", function (_) {
    _.define.object("testobject", function(supermodel) {
        this._modelname = "testobject"
        this.modelname = function () { return this._modelname }
        this.construct = _.noop

        this.test = function() {
            return("Test is working")
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
.ontest("testobject", function(_) {
    var test = _.make.testobject()

    this.test(test.test(), "Test is working")

    _.helper.oop.delmodel("testobject")
})  

