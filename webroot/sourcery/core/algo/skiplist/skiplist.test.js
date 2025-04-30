_.ambient.module("skiplist.test")
    .onload(function(_) {
        var itemcount = 300

        _.debug.assertstart("skiplist")
        var list = _.make.core.skiplist().segmentsize(2)

        for (var index = 1; index <= itemcount; index++) {
            _.make.core.skiplistnode(index).assign(list, -1)
        }

        var makeline = function(node, index) {
            var line = index + "\t" + (node.isroot()? "Root": node.value()) + "\t==>"

            var cursor = node.segmentup()
            while (cursor) {
                line += "\t" + cursor.__childcount
                cursor = cursor.segmentup()
            }
            return line
        }

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
                    _.debug.assert(true, false, "List order mismatch")
                    return _.done

                }
            })
        }

        _.debug(makeline(list, 0))

        list.foreach(function(node, index) {
            _.debug(makeline(node, index))
        })

        _.debug.assert(list.debugvalidate(), undefined, "list.debugvalidate() - ordered index")
        testorderindex(list)

        // Test find relative node with random positions
        _.debug("Testing findrelativenode with random positions:")
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
            
            // Test forward movement
            var forwardnode = list.findrelativenode(startnode, forwardsteps)
            if (!forwardnode || !forwardnode.value || forwardnode.value() != startpos + forwardsteps) {
//                var forwardnode = list.findrelativenode(startnode, forwardsteps)
                _.debug.assert(-1, startpos + forwardsteps, "Forward from " + startpos + " by " + forwardsteps)
            }
            
            // Test backward movement
            var backwardnode = list.findrelativenode(startnode, backwardsteps)
            if (!backwardnode || !backwardnode.value || backwardnode.value() != startpos + backwardsteps) {
                var backwardnode = list.findrelativenode(startnode, backwardsteps)
                _.debug.assert(-1, startpos + backwardsteps, "Backward from " + startpos + " by " + backwardsteps)
            }
        }

        // Test boundary conditions with fixed positions
        _.debug("Testing findrelativenode boundary conditions:")
        
        // Test from first node
        var firstnode = list.nodefirst()
        _.debug.assert(firstnode.value(), 1, "firstnode.value()")
        _.debug.assert(list.findrelativenode(firstnode, -1), undefined, "list.findrelativenode(firstnode, -1)")
        _.debug.assert(list.findrelativenode(firstnode, 1).value(), 2, "list.findrelativenode(firstnode, 1)")
        _.debug.assert(list.findrelativenode(firstnode, itemcount - 1).value(), itemcount, "list.findrelativenode(firstnode, itemcount - 1)")
        _.debug.assert(list.findrelativenode(firstnode, itemcount), undefined, "list.findrelativenode(firstnode, itemcount)")

        // Test from last node
        var lastnode = list.nodelast()
        _.debug.assert(lastnode.value(), itemcount, "Last node value")
        _.debug.assert(list.findrelativenode(lastnode, 0).value(), itemcount, "list.findrelativenode(lastnode, 0)")
        _.debug.assert(list.findrelativenode(lastnode, 1), undefined, "list.findrelativenode(lastnode, 1)")
        _.debug.assert(list.findrelativenode(lastnode, -1).value(), itemcount - 1, "list.findrelativenode(lastnode, -1)")
        _.debug.assert(list.findrelativenode(lastnode, -(itemcount - 1)).value(), 1, "list.findrelativenode(lastnode, -(itemcount - 1))")
        _.debug.assert(list.findrelativenode(lastnode, -itemcount), undefined, "list.findrelativenode(lastnode, -itemcount)")

        // Test from middle node (position 125)
        var middlepos = Math.floor(itemcount / 2)
        var middlenode = list.nodebyindex(middlepos)
        _.debug.assert(middlenode.value(), middlepos, "middlenode.value()")
        _.debug.assert(list.findrelativenode(middlenode, itemcount - middlepos + 1), undefined, "list.findrelativenode(middlenode, itemcount - middlepos + 1)")
        _.debug.assert(list.findrelativenode(middlenode, -middlepos - 1), undefined, "list.findrelativenode(middlenode, -middlepos - 1)")
        _.debug.assert(list.findrelativenode(middlenode, middlepos).value(), itemcount, "list.findrelativenode(middlenode, middlepos)")
        _.debug.assert(list.findrelativenode(middlenode, -(middlepos - 1)).value(), 1, "list.findrelativenode(middlenode, -(middlepos - 1))")

        _.debug.assertfinish()







        // var result = []

        // list.foreach(function(node) {
        //     var level = node.__topsegment.__level
        //     result[level] = (result[level] || 0) + 1
        // })

        // console.log("Level\tCount")
        // var total = 0

        // for (var index = 0; index <= result.length; index++) {
        //     if (result[index]) {
        //         total += result[index]
        //     }
        // }

        // for (var index = 0; index <= result.length; index++) {
        //     var levelvalue = result[index]

        //     if (levelvalue) {
        //         console.log(index + "\t" + levelvalue  + "\t" + _.math.perc(levelvalue, total))
        //     }
        // }        

    })
