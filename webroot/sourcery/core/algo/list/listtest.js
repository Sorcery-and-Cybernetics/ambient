_.ambient.module("listtest")
    .ontest("listtest", function(_) {
        _.define.object("listtestitem", function () {
            this._name = ""
            this._value = ""

            this.construct = function (name, value) {
                this._name = name
                this._value = value
            }
            
            this.name = function () {
                return this._name
            }

            this.value = function () {
                return this._value
            }
        })

        var list = _.model.list("name")

        _.foreach(["A", "B", "C"], function(name) {
            for (var index = 1; index <= 4; index++) {
                var item = _.model.listtestitem(name, index)
                list.add(item)
            }
        })

        var result = []
        var item

        list.foreach(function(item) {
            result.push(item.name() + item.value())
        })

        this.assert(result, ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"], "list.foreach")

        item = list.get("B", 0)
        _.debug(item.name(), item.value())        

        item = list.get("B", 1)
        _.debug(item.name(), item.value())


        item = list.get("B", 2)
        _.debug(item.name(), item.value())

        item = list.get("B", -1)
        _.debug(item.name(), item.value())        

        item = list.get(null, 0) 

        item = list.get(null, 1)
        _.debug(item.name(), item.value())        

        item = list.get(null, -1)
        _.debug(item.name(), item.value())        


        debugger
    })