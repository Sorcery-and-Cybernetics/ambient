_.ambient.module("test.list")
    .ontest("listtest", function(_) {
        _.define.object("listtestitem", function () {
            this._name = ""
            this._value = ""

            this.construct = function (name, value) {
                this._name = name
                this._value = value
            }
            
            this.name = function () { return this._name }
            this.value = function () { return this._value }
            this.debugout = function() { return this._name + this._value }
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
        this.test(list.get("B", 0).debugout()).is("B1", "list.get(B, 0)")
        this.test(list.get("B", 1).debugout()).is("B1", "list.get(B, 1)")
        this.test(list.get("B", 2).debugout()).is("B2", "list.get(B, 2)")
        this.test(list.get("B", -1).debugout()).is("B4", "list.get(B, -1)")

    })