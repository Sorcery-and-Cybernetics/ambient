_.ambient.module("testmodel", function(_) {
    //Define a new object that uses the trait
    _.define.object("test.model", function(supermodel) {
        this.teststring = _.model.string("Test String")  //Basic type: String
    })

})
.ontest("testmodel", function(_) {    
    var object1 = _.model.test.model() 

    var x = object1.teststring()

    this.test(object1.teststring().get(), "Test String")
    this.test(object1.teststring().value(), "Test String")

    object1.teststring().let("New String")
    this.test(object1.teststring(), "New String")

    //_.console.log("mooo!!!")
})  

