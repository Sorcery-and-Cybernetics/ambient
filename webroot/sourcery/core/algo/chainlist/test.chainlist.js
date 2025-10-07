_.ambient.module("test.chainlist")
    .ontest("chainlist", function(_) {
        var list = _.model.chainlist()
        
        var node3 = _.model.chainlistnode("3").assignto(list, -1)
        var node1 = _.model.chainlistnode("1").assignto(list, 1) 

        var node5 = _.model.chainlistnode("5").assignto(list) 

        var node2 = _.model.chainlistnode("2").assignto(node3)
        var node4 = _.model.chainlistnode("4").assignto(node5)   

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Adding items")
        this.assert(list.debugvalidate(), null, "After adding items")

        node3.destroy()
        node1.destroy()
        node5.destroy()

        this.assert(list.debugout(), ["2","4"], "Linked list: Removing items")
        this.assert(list.debugvalidate(), null, "After removing items")

        var node1 = _.model.chainlistnode("1").assignto(node2)
        var node5 = _.model.chainlistnode("5").assignto(node4, 1)
        var node3 = _.model.chainlistnode("3").assignto(node4)

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Reading items")
        this.assert(list.debugvalidate(), null, "After reading items")

        _.model.chainlistnode("0").assignto(list, 1)
        _.model.chainlistnode("6").assignto(list)

        this.assert(list.debugout(), ["0", "1","2","3","4","5", "6"], "Linked list: Adding more items")
        this.assert(list.debugvalidate(), null, "After adding more items")        
    })