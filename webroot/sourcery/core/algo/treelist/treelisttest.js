//*************************************************************************************************
// treelisttest - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("treelisttest", function (_) {
})
.onload(function (_) {
    _.define.core.object("core.treelisttestitem", function () {
        this._name = "";
        this._value = "";
        this._indexof = null;

        this.initialize = function (name, value) {
            this._name = name;
            this._value = value;
        };
        
        this.name = function () {
            return this._name;
        };

        this.value = function () {
            return this._value;
        };
    })

    var debugshow = false

    var list = _.make.core.treesortlist()

    var itemnames = ["A", "B", "C"]
    var x = 0
    var y = 0

    var maxx = 3
    var maxy = 3

    for (var y = maxy; y >= 1; y--) {
        for (var x = maxx; x >= 1; x--) {
            _.foreach(itemnames, function (key) {
                var itemkey = key + (x || "")

                var item = _.make.core.treelisttestitem(itemkey, itemkey)

                list.push(item)

                _.debug.assert(list.debugvalidate())
            })
        }
    }
    
    if (debugshow) { list.debugdump() }
    
    var counter = 0

    while (true) {
        counter++

        var item = list.getbypos(counter)
        if (!item) { break }

        var itemkey = item.name()
        var itemvalue = item.value()
        item.destroy()

        var item = _.make.core.treelisttestitem(itemkey, itemvalue)
        
        _.debug.assert(list.debugvalidate())
        list.push(item)    
        _.debug.assert(list.debugvalidate())
    }
    
    if (debugshow) { 
       var counter = 0
       _.foreach(itemnames, function (key) {
           for (var x = 1; x <= maxx; x++) {
               var itemkey = key + x
               counter += 1
    
               var itembypos = list.getbypos(counter * maxy)
               var itemfirst = list.findfirstnode(itemkey)
               var itemlast = list.findlastnode(itemkey)
    
               _.debug(itembypos.name(), itemfirst.name(), itemlast.name(), itembypos.position(), itemfirst.position(), itemlast.position())
           }
       })
       _.debug()
    }
    
    _.debug.assert(list.debugvalidate())    
})    
