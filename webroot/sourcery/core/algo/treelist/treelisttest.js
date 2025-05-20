//*************************************************************************************************
// treelisttest - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("treelisttest")
.ontest("treelisttest", function (_) {
    var me = this

    _.define.object("treelisttestitem", function () {
        this.__name = "";
        this.__value = "";
        this.__indexof = null;

        this.construct = function (name, value) {
            this.__name = name;
            this.__value = value;
        };
        
        this.name = function () {
            return this.__name;
        };

        this.value = function () {
            return this.__value;
        };
    })

    var debugshow = false

    var list = _.model.treesortlist()

    var itemnames = ["A", "B", "C"]
    var x = 0
    var y = 0

    var maxx = 3
    var maxy = 3

    this.group("Add item test")
    
    for (var y = maxy; y >= 1; y--) {
        for (var x = maxx; x >= 1; x--) {
            _.foreach(itemnames, function (key) {
                var itemkey = key + (x || "")

                var item = _.model.treelisttestitem(itemkey, itemkey)

                list.push(item)

                me.assert(list.debugvalidate(), true, "additem test " + itemkey)
            })
        }
    }
    
    if (debugshow) { list.debugdump() }
    
    var counter = 0

    this.group("Remove and add item test")
    while (true) {
        counter++

        var item = list.getbypos(counter)
        if (!item) { break }

        var itemkey = item.name()
        var itemvalue = item.value()
        item.destroy()

        var item = _.model.treelisttestitem(itemkey, itemvalue)
        
        this.assert(list.debugvalidate(), true, "removeitem test " + itemkey)    
        list.push(item)    
        this.assert(list.debugvalidate(), true, "additem test " + itemkey)    
    }
    
    if (debugshow) { 
       var counter = 0
       _.foreach(itemnames, function (key) {
           for (var x = 1; x <= maxx; x++) {
               var itemkey = key + x
               counter += 1
    
               var itembypos = list.getbypos(counter * maxy)
               var itemfirst = list.findnodefirst(itemkey)
               var itemlast = list.findnodelast(itemkey)
    
               _.debug(itembypos.name(), itemfirst.name(), itemlast.name(), itembypos.position(), itemfirst.position(), itemlast.position())
           }
       })
       _.debug()
    }
    
    this.assert(list.debugvalidate(), true, "Final validation")    
})    
