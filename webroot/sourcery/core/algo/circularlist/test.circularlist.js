_.ambient.module("test.circularlist")
    .ontest("circularlist", function(_) {

        //************************************************************
        // Rooted circular list test
        //************************************************************
        var list = _.model.circularlist()

        // create nodes and insert relative to root
        var node3 = _.model.circularlistnode("3").assignafter(list)
        var node1 = _.model.circularlistnode("1").assignbefore(node3)
        var node5 = _.model.circularlistnode("5").assignafter(node3._list._prevnode) // tail insert
        var node2 = _.model.circularlistnode("2").assignbefore(node3)
        var node4 = _.model.circularlistnode("4").assignafter(node3)

        this.assert(list.debugout(), ["1","2","3","4","5"], "circularlist (rooted): adding items")

        node3.destroy()
        node1.destroy()
        node5.destroy()

        this.assert(list.debugout(), ["2","4"], "circularlist (rooted): removing items")

        var node1 = _.model.circularlistnode("1").assignbefore(node2)
        var node5 = _.model.circularlistnode("5").assignafter(node4)
        var node3 = _.model.circularlistnode("3").assignbefore(node4)

        this.assert(list.debugout(), ["1","2","3","4","5"], "circularlist (rooted): rebuilding items")

        _.model.circularlistnode("0").assignbefore(node1)
        _.model.circularlistnode("6").assignafter(node5)

        this.assert(list.debugout(), ["0","1","2","3","4","5","6"], "circularlist (rooted): adding more items")


        //************************************************************
        // Rootless circular list test
        //************************************************************
        var a = _.model.circularlistnode("a")
        var b = _.model.circularlistnode("b").assignafter(a)
        var c = _.model.circularlistnode("c").assignafter(b)
        var d = _.model.circularlistnode("d").assignbefore(c)

        // Collect values by looping manually (since no root.debugout)
        var values = []
        var cursor = a
        do {
            values.push(cursor.value())
            cursor = cursor.nextnode()
        } while (cursor && cursor != a)

        this.assert(values, ["a","b","d","c"], "circularlist (rootless): adding items")

        // destroy b and c
        b.destroy()
        c.destroy()

        // verify remaining order
        var values2 = []
        cursor = a
        do {
            values2.push(cursor.value())
            cursor = cursor.nextnode()
        } while (cursor && cursor != a)

        this.assert(values2, ["a","d"], "circularlist (rootless): removing items")
    })
