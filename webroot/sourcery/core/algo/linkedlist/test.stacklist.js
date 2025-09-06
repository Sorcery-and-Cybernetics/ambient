_.ambient.module("test.stacklist")
.ontest("stacklist", function(_) {
    var stack = _.model.stacklist()
    
    var pushednode = stack.push(10)
    var pushednode = stack.push(20)
    var pushednode = stack.push(30)

    stack.pushfirst(5)

    this.assert(stack.first(), 5, "First node value should be 5")
    this.assert(stack.last(), 30, "Last node value should be 30")
    this.assert(stack.count(), 4, "Stack length should be 4")

    var value = stack.pop()
    this.assert(value, 30, "Popped value should be 30")

    value = stack.popfirst()
    this.assert(value, 5, "Popped first value should be 5")

    this.assert(stack.first(), 10, "First node value should be 10")
    this.assert(stack.last(), 20, "First node value should be 20")
})
