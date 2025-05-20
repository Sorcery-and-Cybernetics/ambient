_.ambient.module("testobject")
.ontest("testobject", function(_) {
    _.define.object("testobject", function(supermodel) {
        this._modelname = "testobject"
        this.modelname = function () { return this._modelname }
        this.construct = _.noop

        this.test = _.model.method(function() {
            return("Test is working")
        })
    })

    var test = _.model.testobject()

    _.debug(test.test())

    this.test(test.test(), "Test is working")

    _.helper.oop.delmodel("testobject")
})  

