_.ambient.module("testobject", function(_) {
    _.define.object("testobject", function(supermodel) {
        this._modelname = "testobject"
        this.modelname = function () { return this._modelname }
        this.construct = _.noop

        this.name = _.model.property("testobject")

        this.test = _.model.method(function() {
            return("Test is working")
        })
    })
})

.ontest("testobject", function(_) {    

    var test = _.model.testobject()

    test.name("Test Object")
    this.test(test.name(), "Test Object")
    this.test(test.test(), "Test is working")

    _.helper.oop.delmodel("testobject")
})  

