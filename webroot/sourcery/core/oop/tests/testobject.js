_.ambient.module("testobject", function(_) {

    //Define a new trait
    _.define.object("test.trait", function(supermodel) {
        this._initial = undefined
        this._value = undefined

        this.construct = function(value) { //the constructor
            if (value) { this._value = value }
        }

        this.destroy = function() { //the destructor
            this._value = undefined
            this._initial = undefined
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

    //Define a new object that uses the trait
    _.define.object("test.object", function(supermodel) {
        this.test = _.model.method(function() { 
            this.ontest("Test is working")
            return("Test is working")
        })

        this.testproperty = _.model.property("Test Property")
        this.testtrait = _.model.test.trait("Value").initial("Initial Value") //Custom type: TestTrait
        this.ontest = _.model.basicsignal()
    })

    //Inherit and override testtrait
    _.define.test.object("test.object2", function(supermodel) {
        this.testtrait = _.model.test.trait().initial("Initial Value 2")  //We override here the initial value. Our inheritance model includes composited objects.
    })
})

.ontest("testobject", function(_) {    
    var object1 = _.model.test.object() 
    var object2 = _.model.test.object2()

    var eventtest = false

    //test first object
    object1.name("Test Object")
    object1.ontest(function() {
        eventtest = true
    })

    this.test(object1.name(), "Test Object") 
    this.test(object1.test(), "Test is working")
    this.test(eventtest, true)

    this.test(object1.testtrait().get(), "Value")

    object1.testtrait().let("New Value")
    this.test(object1.testtrait().get(), "New Value")

    //testing 2nd testobject
    this.test(object2.testtrait().get(), "Initial Value 2")
    this.test(object2.testtrait().initial(), "Initial Value 2")
})  

