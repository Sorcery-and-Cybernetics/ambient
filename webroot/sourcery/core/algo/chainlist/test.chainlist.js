_.ambient.module("test.chainlist")
    .ontest("chainlist", function(_) {
        var list = _.model.chainlist()
        
        var node3 = _.model.chainlistnode("3").assign(list, -1)
        var node1 = _.model.chainlistnode("1").assign(list, 1) 

        var node5 = _.model.chainlistnode("5").assign(list) 

        var node2 = _.model.chainlistnode("2").assign(node3)
        var node4 = _.model.chainlistnode("4").assign(node5)   

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Adding items")
        this.assert(list.debugvalidate(), null, "After adding items")

        node3.destroy()
        node1.destroy()
        node5.destroy()

        this.assert(list.debugout(), ["2","4"], "Linked list: Removing items")
        this.assert(list.debugvalidate(), null, "After removing items")

        var node1 = _.model.chainlistnode("1").assign(node2)
        var node5 = _.model.chainlistnode("5").assign(node4, 1)
        var node3 = _.model.chainlistnode("3").assign(node4)

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Reading items")
        this.assert(list.debugvalidate(), null, "After reading items")

        _.model.chainlistnode("0").assign(list, 1)
        _.model.chainlistnode("6").assign(list)

        this.assert(list.debugout(), ["0", "1","2","3","4","5", "6"], "Linked list: Adding more items")
        this.assert(list.debugvalidate(), null, "After adding more items")        
    })