_.ambient.module("test.skiplistroot")
    .ontest("skiplistroot", function(_, next) {
        var me = this
        var showdebug = false

        var itemcount = 300

        // Helper function to output list structure
        var segmentdump = function(list) {
            var makeline = function(node, index) {
                var nodevalue
                if (node.isroot()) { 
                    nodevalue = "Root" 
                } else { 
                    nodevalue = node.value() 
                    if (_.isobject(nodevalue)) { nodevalue = nodevalue.debugout()}
                }
                
                var line = index + "\t" + nodevalue + "\t==>"

                var cursor = node.segmentup()
                while (cursor) {
                    line += "\t" + cursor._childcount + "(" + cursor._nodecount + ")"
                    cursor = cursor.segmentup()
                }
                return line
            }

            _.debug(makeline(list, 0))

            list.foreach(function(node, index) {
                _.debug(makeline(node, index))
            })
        }

        // Helper function to verify node ordering and indexing consistency
        var testorderindex = function(list) {
            list.foreach(function(node, index) {
                var nodeposition = node.orderindex()
                var found = list.nodebyindex(index)
                if (!found || !found.orderindex) { 
                    var found = list.nodebyindex(index)
                    _.debug.assert(true, false, "List order mismatch"); return }
                var foundindex = found.orderindex()

//                _.debug(index + "\t" + nodeposition + "\t" + foundindex)

                if ((foundindex != index) || (nodeposition != index)) {
                    me.assert(true, false, "List order mismatch")
                    return _.done

                }
            })
        }

        //**************************************
        // Test start
        //**************************************

        var list = _.model.skiplistroot().segmentsize(2)

        // Populate the skiplist with 300 nodes with values 1-300
        for (var index = 1; index <= itemcount; index++) {
            _.model.skiplistnode(index).assign(list, -1)
        }        

        if (showdebug) { segmentdump(list) }

        // Verify list structure and ordering
        this.assert(list.debugvalidate(), null, "list.debugvalidate() - ordered index")
        testorderindex(list)

        me.group("Testing findrelativenode with random positions")
        for (var i = 0; i < 100; i++) {
            // Get random start position (1 to itemcount)
            var startpos = Math.floor(Math.random() * (itemcount - 2)) + 2
            if (startpos == 0) { 
                startpos = 1
             }
            var startnode = list.nodebyindex(startpos)
            
            // Calculate max possible moves in each direction
            var maxforward = itemcount - startpos
            var maxbackward = startpos - 1
            
            // Get random relative positions within bounds
            var forwardsteps = Math.floor(Math.random() * maxforward) + 1
            var backwardsteps = -(Math.floor(Math.random() * maxbackward) + 1)
            
            // Test forward movement - verify we can navigate forward correctly
            var forwardnode = list.findrelativenode(startnode, forwardsteps)
            if (!forwardnode || !forwardnode.value || forwardnode.value() != startpos + forwardsteps) {
                me.assert(-1, startpos + forwardsteps, "Forward from " + startpos + " by " + forwardsteps)
            }
            
            // Test backward movement - verify we can navigate backward correctly
            var backwardnode = list.findrelativenode(startnode, backwardsteps)
            if (!backwardnode || !backwardnode.value || backwardnode.value() != startpos + backwardsteps) {
                var backwardnode = list.findrelativenode(startnode, backwardsteps)
                me.assert(-1, startpos + backwardsteps, "Backward from " + startpos + " by " + backwardsteps)
            }
        }

        me.group("Testing findrelativenode boundary conditions")
        var firstnode = list.firstnode()

        _.debug.assert(firstnode.value(), 1, "firstnode.value()")
        _.debug.assert(list.findrelativenode(firstnode, -1), null, "list.findrelativenode(firstnode, -1)")
        _.debug.assert(list.findrelativenode(firstnode, 1).value(), 2, "list.findrelativenode(firstnode, 1)")
        _.debug.assert(list.findrelativenode(firstnode, itemcount - 1).value(), itemcount, "list.findrelativenode(firstnode, itemcount - 1)")
        _.debug.assert(list.findrelativenode(firstnode, itemcount), null, "list.findrelativenode(firstnode, itemcount)")

        // Test navigation from last node
        var lastnode = list.lastnode()
        _.debug.assert(lastnode.value(), itemcount, "Last node value")
        _.debug.assert(list.findrelativenode(lastnode, 0).value(), itemcount, "list.findrelativenode(lastnode, 0)")
        _.debug.assert(list.findrelativenode(lastnode, 1), null, "list.findrelativenode(lastnode, 1)")

        _.debug.assert(list.findrelativenode(lastnode, -1).value(), itemcount - 1, "list.findrelativenode(lastnode, -1)")
        _.debug.assert(list.findrelativenode(lastnode, -(itemcount - 1)).value(), 1, "list.findrelativenode(lastnode, -(itemcount - 1))")
        _.debug.assert(list.findrelativenode(lastnode, -itemcount), null, "list.findrelativenode(lastnode, -itemcount)")

        // Test navigation from middle node
        var middlepos = Math.floor(itemcount / 2)
        var middlenode = list.nodebyindex(middlepos)
        _.debug.assert(middlenode.value(), middlepos, "middlenode.value()")
        _.debug.assert(list.findrelativenode(middlenode, itemcount - middlepos + 1), null, "list.findrelativenode(middlenode, itemcount - middlepos + 1)")
        _.debug.assert(list.findrelativenode(middlenode, -middlepos - 1), null, "list.findrelativenode(middlenode, -middlepos - 1)")
        _.debug.assert(list.findrelativenode(middlenode, middlepos).value(), itemcount, "list.findrelativenode(middlenode, middlepos)")
        _.debug.assert(list.findrelativenode(middlenode, -(middlepos - 1)).value(), 1, "list.findrelativenode(middlenode, -(middlepos - 1))")

        // Test delete-insert
        for (var position = 1; position <= itemcount; position++) {
            var node = list.nodebyindex(position)
            var value = node.value()
            
            node = node.destroy()

            _.debug.assert(list.debugvalidate(), null, "List validation after deleting node at position " + position)
            if (itemcount <=  1000) { testorderindex(list) }

             _.model.skiplistnode(value).assign(list, -1)

             _.debug.assert(list.debugvalidate(), null, "List validation after reinserting value " + value)

            if (itemcount <=  1000) { testorderindex(list) }
        } 

        testorderindex(list)


        for (var position = 1; position <= itemcount; position++) {
            var node = list.nodebyindex(1)

            node = node.destroy()

            _.debug.assert(list.debugvalidate(), null, "List validation after deleting node at position " + position)
            testorderindex(list)
        }

        

        _.model.skiplistnode(1).assign(list, -1)
        _.debug.assert(list.debugvalidate(), null, "After deleting all nodes, and inserting 1")

        var list = _.model.skiplistroot();
        list.issortlist(true)
    
        me.group("Testing a shuffled list of nodes")
        var itemcount = 20
        var valuecount = 50
        var items = []
        
        for (var i = 0; i < itemcount; i++) {
            for (var j = 0; j < valuecount; j++) {
                var value = String.fromCharCode(65 + i) + j 
                items.push(value)               
            }
        }
       
        items = _.array.shuffle(items)

        _.foreach(items, function(item) {
            list.add(item)
        });

        if (showdebug) { segmentdump(list) }
        me.assert(list.debugvalidate(), null, "List validation after creating shuffled list")
        

        me.group("Testing findfirstnode, findnextnode, findlastnode, findprevnode")

        var list = _.model.skiplistroot()
        list.issortlist(true)

        var itemcount = 3
        var valuecount = 30
        var items = []
        
        for (var i = 0; i < itemcount; i++) {
            for (var j = 1; j <= valuecount; j++) {
                list.add(String.fromCharCode(65 + i), j)
            }
        }

         _.debug.assert(list.findfirstnode("XX"), null, "list.findfirstnode(XX)")
         _.debug.assert(list.findfirstnode("A").orderindex(), 1, "list.findfirstnode(A)")
         _.debug.assert(list.findfirstnode("B").orderindex(), 1 + valuecount, "list.findfirstnode(B)")
         _.debug.assert(list.findfirstnode("C").orderindex(), 1 + valuecount * 2, "list.findfirstnode(C)")

         _.debug.assert(list.findlastnode("A").orderindex(), valuecount, "list.findlastnode(A)")
         _.debug.assert(list.findlastnode("B").orderindex(), valuecount * 2, "list.findlastnode(B)")
         _.debug.assert(list.findlastnode("C").orderindex(), valuecount * 3, "list.findlastnode(C)")

         var node = list.findfirstnode("B")
         _.debug.assert(list.findnextnode(node, "B").orderindex(), 2 + valuecount, "list.findnextnode(B)")
         _.debug.assert(list.findnextnode(node, "C").orderindex(), 1 + valuecount * 2, "list.findnextnode(C)")

         var node = list.findlastnode("B")
         var node2 = list.findprevnode(node, "A")
         _.debug.assert(list.findprevnode(node, "B").orderindex(), -1 + valuecount * 2, "list.findprevnode(B)")
         _.debug.assert(list.findprevnode(node, "A").orderindex(), valuecount, "list.findprevnode(A)")
    })
