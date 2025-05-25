_.ambient.module("testobject", function(_) {
    _.define.object("testtrait", function(supermodel) {
        this._initial = undefined
        this._value = undefined
        this._temp = undefined

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

        this.temp = function(value) {
            if (value === undefined) { return this._temp }
            this._temp = value
            return this
        }
    })

    _.define.object("testobject", function(supermodel) {
        this.test = _.model.method(function() {
            return("Test is working")
        })

        this.testtrait = _.model.testtrait("Initial Value").temp("Temporary Value")
    })

    //Inherit and override testtrait
    _.define.testobject("testobject2", function(supermodel) {
        this.testtrait = _.model.testtrait().temp("Temporary Value 2")
    })
})

.ontest("testobject", function(_) {    
    var test = _.model.testobject()
    var test2 = _.model.testobject2()

    test.name("Test Object")
    this.test(test.name(), "Test Object")
    this.test(test.test(), "Test is working")

    this.test(test.testtrait().get(), "Initial Value")

    test.testtrait().let("New Value")
    this.test(test.testtrait().get(), "New Value")

    //testing 2nd testobject
    this.test(test2.testtrait().get(), "Initial Value")
    this.test(test2.testtrait().temp(), "Temporary Value 2")
})  

