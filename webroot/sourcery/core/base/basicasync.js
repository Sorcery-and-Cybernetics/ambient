_.ambient.module("basicasync", function(_) {
    //Async foreach function using callback method
    _.foreachasync = function (items, fn, finish) {
        //first if items not array, convert to array
        if (!_.isarray(items)) {
            var newitems = []
            _.foreach(items, function (item) { newitems.push(item) })
            items = newitems
        }

        if (items.length == 0) {
            if (finish) { finish() }
            return
        }

        //execute function for each item in the array
        var execute = function (index) {
            if (index >= items.length) {
                if (finish) { finish() }
                return
            }

            var item = items[index]
            fn(item, function () { execute(index + 1) })
        }

        execute(0)        
    }
})