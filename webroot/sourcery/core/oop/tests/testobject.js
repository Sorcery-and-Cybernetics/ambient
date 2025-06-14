_.ambient.module("testobject", function(_) {
    _.define.object("testtrait", function(supermodel) {
        this._initial = undefined
        this._value = undefined
        this._temp = undefined

        this.construct = function(value) {
            if (value) { this._value = value }
        }

        this.let = function (value) {
            this._value = value
            return this
        }

        this.get = function () {
            return this._value || this._initial
        }

        this.initial = function(value) {
            if (value === undefined) { return this._initial }
            this._initial = value
            return this
        }
    })

    _.define.object("testobject", function(supermodel) {
        this.test = _.model.method(function() {
            return("Test is working")
        })

        this.teststring = _.model.string("Test String")
        this.testtrait = _.model.testtrait("Value").initial("Initial Value")
    })

    //Inherit and override testtrait
    _.define.testobject("testobject2", function(supermodel) {
        this.testtrait = _.model.testtrait().initial("Temporary Value 2")
    })
})

.ontest("testobject", function(_) {    
    var test = _.model.testobject()
    var test2 = _.model.testobject2()

    test.name("Test Object")
    this.test(test.name(), "Test Object")
    this.test(test.test(), "Test is working")

    this.test(test.testtrait().get(), "Value")

    test.testtrait().let("New Value")
    this.test(test.testtrait().get(), "New Value")
    this.test(test.testtrait().teststring(), "Test String")

    //testing 2nd testobject
    this.test(test2.testtrait().get(), "Temporary Value 2")
    this.test(test2.testtrait().initial(), "Temporary Value 2")

    this.test(test2.testtrait().teststring(), "Test String")
    test2.teststring().let("New String")
    this.test(test2.testtrait().teststring(), "New String")
})  

