_.ambient.module("testmodelvalue")

.ontest("testmodelvalue", function(_) {    
    var str1 = _.model.string("String 1")
    var str2 = _.model.string("String 2")

    this.assert(str1.get(), "String 1", "String 1")
    this.assert(str2.get(), "String 2", "String 2")

    str1.set(str2)
    var value = str1.get()

    this.assert(str1.get(), "String 2", "String 2")
})  

