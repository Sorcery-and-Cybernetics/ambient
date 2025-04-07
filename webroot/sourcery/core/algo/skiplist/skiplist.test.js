_.ambient.module("skiplist.test")
    .onload(function(_) {
        _.debug.assertstart("skiplist")
        var list = _.make.core.skiplist().segmentsize(2)

        for (var index = 1; index <= 200; index++) {
            _.make.core.skiplistnode(index).assign(list, -1)
        }

        var makeline = function(node, index) {
            var line = index + "\t" + (node.isroot()? "Root": node.value())

            var cursor = node.segmentup()
            while (cursor) {
                line += "\t" + cursor.__childcount
                cursor = cursor.segmentup()
            }
            return line
        }

        var testorder = function(list, debugmode) {
            list.foreach(function(node, index) {
                var nodeposition = node.position()
                //var found = list.findnode(index)

                if ((nodeposition != index)) {
                //if (!found || (found.orderindex() != index) || (nodeposition != index)) {
                    _.debug.assert(true, false, "List order mismatch")
                    return _.done

                }
            })
        }

        _.debug(makeline(list, 0))

        list.foreach(function(node, index) {
            _.debug(makeline(node, index))
        })


        _.debug.assert(list.debugvalidate(), undefined)
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