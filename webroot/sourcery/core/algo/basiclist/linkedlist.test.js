_.ambient.module("linkedlist.test")
    .ontest("linkedlist", function(_) {
        var list = _.make.core.linkedlist()
        
        var node3 = _.make.core.linkedlistnode("3").assign(list, -1)
        var node1 = _.make.core.linkedlistnode("1").assign(list, 1) 
        var node5 = _.make.core.linkedlistnode("5").assign(list) 

        var node2 = _.make.core.linkedlistnode("2").assign(node3)
        var node4 = _.make.core.linkedlistnode("4").assign(node3, 1)   

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Adding items")
        this.assert(list.debugvalidate(), undefined, "After adding items")

        node3.destroy()
        node1.destroy()
        node5.destroy()

        this.assert(list.debugout(), ["2","4"], "Linked list: Removing items")
        this.assert(list.debugvalidate(), undefined, "After removing items")

        var node1 = _.make.core.linkedlistnode("1").assign(node2)
        var node5 = _.make.core.linkedlistnode("5").assign(node4, 1)
        var node3 = _.make.core.linkedlistnode("3").assign(node4)

        this.assert(list.debugout(), ["1","2","3","4","5"], "Linked list: Reading items")
        this.assert(list.debugvalidate(), undefined, "After reading items")

        _.make.core.linkedlistnode("0").assign(list, 1)
        _.make.core.linkedlistnode("6").assign(list)

        this.assert(list.debugout(), ["0", "1","2","3","4","5", "6"], "Linked list: Adding more items")
        this.assert(list.debugvalidate(), undefined, "After adding more items")
    })