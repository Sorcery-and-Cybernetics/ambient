_.ambient.module("test.model")
    .ontest("testmutation", function(_) {    
        _.define.model("testmodel", function(supermodel) {
            this.text = _.model.string()
        })

        var model1 = _.model.testmodel()

        model1.onchildchange(function(mutation) {
            _.debug("Child change (" + mutation.name() + "): " + mutation.parentid() + " = " + mutation.value())
        })         

        model1.text().let("Hello World")
        var x = model1.text().get()

  
        
    })