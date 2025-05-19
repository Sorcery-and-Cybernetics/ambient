_.ambient.module("skiplist.test")
    .ontest("skiplist", function(_, next) {
        var me = this
        var showdebug = false

        var itemcount = 10

        var list = _.make.skiplist().segmentsize(2)

        // Populate the skiplist with 300 nodes with values 1-300
        for (var index = 1; index <= itemcount; index++) {
            _.make.skiplistnode(index).assign(list, -1)
        }

        // Helper function to output list structure
        var segmentdump = function(list) {
            var makeline = function(node, index) {
                var nodevalue
                if (node.isroot()) { 
                    nodevalue = "Root" 
                } else { 
                    nodevalue = node.value() 
                    if (_.ismodel(nodevalue)) { nodevalue = nodevalue.debugout()}
                }
                
                var line = index + "\t" + nodevalue + "\t==>"

                var cursor = node.segmentup()
                while (cursor) {
                    line += "\t" + cursor.__childcount
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

        if (showdebug) { segmentdump(list) }

        // Verify list structure and ordering
        this.assert(list.debugvalidate(), undefined, "list.debugvalidate() - ordered index")
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
        var firstnode = list.nodefirst()
        _.debug.assert(firstnode.value(), 1, "firstnode.value()")
        _.debug.assert(list.findrelativenode(firstnode, -1), undefined, "list.findrelativenode(firstnode, -1)")
        _.debug.assert(list.findrelativenode(firstnode, 1).value(), 2, "list.findrelativenode(firstnode, 1)")
        _.debug.assert(list.findrelativenode(firstnode, itemcount - 1).value(), itemcount, "list.findrelativenode(firstnode, itemcount - 1)")
        _.debug.assert(list.findrelativenode(firstnode, itemcount), undefined, "list.findrelativenode(firstnode, itemcount)")

        // Test navigation from last node
        var lastnode = list.nodelast()
        _.debug.assert(lastnode.value(), itemcount, "Last node value")
        _.debug.assert(list.findrelativenode(lastnode, 0).value(), itemcount, "list.findrelativenode(lastnode, 0)")
        _.debug.assert(list.findrelativenode(lastnode, 1), undefined, "list.findrelativenode(lastnode, 1)")
        _.debug.assert(list.findrelativenode(lastnode, -1).value(), itemcount - 1, "list.findrelativenode(lastnode, -1)")
        _.debug.assert(list.findrelativenode(lastnode, -(itemcount - 1)).value(), 1, "list.findrelativenode(lastnode, -(itemcount - 1))")
        _.debug.assert(list.findrelativenode(lastnode, -itemcount), undefined, "list.findrelativenode(lastnode, -itemcount)")

        // Test navigation from middle node
        var middlepos = Math.floor(itemcount / 2)
        var middlenode = list.nodebyindex(middlepos)
        _.debug.assert(middlenode.value(), middlepos, "middlenode.value()")
        _.debug.assert(list.findrelativenode(middlenode, itemcount - middlepos + 1), undefined, "list.findrelativenode(middlenode, itemcount - middlepos + 1)")
        _.debug.assert(list.findrelativenode(middlenode, -middlepos - 1), undefined, "list.findrelativenode(middlenode, -middlepos - 1)")
        _.debug.assert(list.findrelativenode(middlenode, middlepos).value(), itemcount, "list.findrelativenode(middlenode, middlepos)")
        _.debug.assert(list.findrelativenode(middlenode, -(middlepos - 1)).value(), 1, "list.findrelativenode(middlenode, -(middlepos - 1))")


        // Test delete-insert
        for (var position = 1; position <= itemcount; position++) {
            var node = list.nodebyindex(position)
            var value = node.value()
            
            node = node.destroy()

            _.debug.assert(list.debugvalidate(), undefined, "List validation after deleting node at position " + position)
            testorderindex(list)

             _.make.skiplistnode(value).assign(list, -1)
            
             _.debug.assert(list.debugvalidate(), undefined, "List validation after reinserting value " + value)
             testorderindex(list)
        } 


        var list = _.make.skiplist();
        list.issortlist(true)
    
        // Create a shuffled list of items
        var itemcount = 5;
        var valuecount = 7;
        var items = [];
        
        for (var i = 0; i < itemcount; i++) {
            for (var j = 0; j < valuecount; j++) {
                var value = String.fromCharCode(65 + i) + j; 
                items.push(value);                
            }
        }
       
        items = _.array.shuffle(items);

        _.foreach(items, function(item) {
            list.add(item);
        });

        if (showdebug) { segmentdump(list) }
        _.debug.assert(list.debugvalidate(), undefined, "List validation after creating shuffled list")


        _.define.object("testskiplistitem", function(supermodel) {
            this.__value = null;
            this.__order = 0

            this.construct = function(value, order) {
                this.__value = value;
                this.__order = order
            }

            this.get = function(name) {
                if (name == "value") { return this.__value; }
                if (name == "order") { return this.__order; }
            }

            this.debugout = function() {
                return this.__value + "\t" + this.__order;
            }            
        })

        var additem = function(list, value, order, tag) {
            if (!tag) { tag = order; }
            var item = _.make.testskiplistitem(value, tag)
            list.add(item, order)
//            segmentdump(list)
        }


        var list = _.make.skiplist("value")

        // Create a shuffled list of items
        var itemcount = 3;
        var valuecount = 3;
        var items = [];
        
        for (var i = 0; i < itemcount; i++) {
            for (var j = 1; j <= valuecount; j++) {
                additem(list, String.fromCharCode(65 + i), j);
            }
        }

        if (showdebug) { segmentdump(list) }

        additem(list, "B", 4)
        if (showdebug) { segmentdump(list) }
        

        additem(list, "C", -5, 4)
        if (showdebug) { segmentdump(list) }

        additem(list, "A", 7, 4)
        if (showdebug) { segmentdump(list) }

    _.debug.assert(list.debugvalidate(), undefined, "List validation after creating shuffled list")

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
