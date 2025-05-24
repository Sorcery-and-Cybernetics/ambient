_.ambient.module("testobject", function(_) {
    _.define.object("testtrait", function(supermodel) {
        this._initial = undefined
        this._value = undefined

        this.construct = function(initial) {
            if (initial) { this._initial = initial }
        }

        this.let = function (value) {
            this._value = value
            return this
        }

        this.get = function () {
            return this._value || this._initial
        }
    })

    _.define.object("testobject", function(supermodel) {
        this.name = _.model.property("testobject")

        this.test = _.model.method(function() {
            return("Test is working")
        })

        this.testtrait = _.model.testtrait("Initial Value")


    })
})

.ontest("testobject", function(_) {    
    var test = _.model.testobject()

    test.name("Test Object")
    this.test(test.name(), "Test Object")
    this.test(test.test(), "Test is working")

    this.test(test.testtrait().get(), "Initial Value")

    test.testtrait().let("New Value")
    this.test(test.testtrait().get(), "New Value")
})  

