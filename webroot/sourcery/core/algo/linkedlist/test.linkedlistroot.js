_.ambient.module("test.linkedlistroot")
    .ontest("linkedlistroot", function(_) {
        var list = _.model.linkedlistroot()
        
        var node3 = _.model.linkedlistnode("3").assignto(list, -1)
        var node1 = _.model.linkedlistnode("1").assignto(list, 1) 

        var node5 = _.model.linkedlistnode("5").assignto(list) 

        var node2 = _.model.linkedlistnode("2").assignto(node3)
        var node4 = _.model.linkedlistnode("4").assignto(list, -2)   

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Adding items")
        this.assert(list.debugvalidate(), null, "After adding items")

        node3.destroy()
        node1.destroy()
        node5.destroy()

        this.assert(list.debugout(), ["2","4"], "Linked list: Removing items")
        this.assert(list.debugvalidate(), null, "After removing items")

        var node1 = _.model.linkedlistnode("1").assignto(node2)
        var node5 = _.model.linkedlistnode("5").assignto(node4, 1)
        var node3 = _.model.linkedlistnode("3").assignto(node4)

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Reading items")
        this.assert(list.debugvalidate(), null, "After reading items")

        _.model.linkedlistnode("0").assignto(list, 1)
        _.model.linkedlistnode("6").assignto(list)

        this.assert(list.debugout(), ["0", "1","2","3","4","5", "6"], "Linked list: Adding more items")
        this.assert(list.debugvalidate(), null, "After adding more items")
    })