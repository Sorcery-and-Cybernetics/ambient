_.ambient.module("test.circularlist")
    .ontest("circularlist", function(_) {

        // helper to loop through nodes and collect values
        function fornodes(startnode) {
            var result = []
            if (!startnode) { return result }
            var cursor = startnode
            do {
                result.push(cursor.value())
                cursor = cursor.nextnode()
            } while (cursor && cursor != startnode)
            return result
        }

        //************************************************************
        // Rooted circular list test
        //************************************************************
        var list = _.model.circularlist()

        // create nodes and insert relative to root
        var node3 = _.model.circularlistnode("3")
        list.add(node3, -1)

        var node1 = _.model.circularlistnode("1")
        list.add(node1, 1)

        var node5 = _.model.circularlistnode("5")
        list.add(node5, -1)

        var node2 = _.model.circularlistnode("2")
        node2.assignbefore(node3)

        var node4 = _.model.circularlistnode("4")
        node4.assignafter(node3)

        this.assert(fornodes(list.first()), ["1","2","3","4","5"], "circularlist (rooted): adding items")

        // remove some nodes
        node3.destroy()
        node1.destroy()
        node5.destroy()

        this.assert(fornodes(list.first()), ["2","4"], "circularlist (rooted): removing items")

        // rebuild list
        var node1 = _.model.circularlistnode("1")
        list.add(node1, 1)

        var node5 = _.model.circularlistnode("5")
        list.add(node5, -1)

        var node3 = _.model.circularlistnode("3")
        node3.assignbefore(node4)

        this.assert(fornodes(list.first()), ["1","2","3","4","5"], "circularlist (rooted): rebuilding items")

        // add more nodes at head and tail
        _.model.circularlistnode("0").assignbefore(node1)
        _.model.circularlistnode("6").assignafter(node5)

        this.assert(fornodes(list.first()), ["0","1","2","3","4","5","6"], "circularlist (rooted): adding more items")


        //************************************************************
        // Rootless circular list test
        //************************************************************
        var a = _.model.circularlistnode("a")
        var b = _.model.circularlistnode("b").assignafter(a)
        var c = _.model.circularlistnode("c").assignafter(b)
        var d = _.model.circularlistnode("d").assignbefore(c)

        this.assert(fornodes(a), ["a","b","d","c"], "circularlist (rootless): adding items")

        // destroy b and c
        b.destroy()
        c.destroy()

        this.assert(fornodes(a), ["a","d"], "circularlist (rootless): removing items")
    })