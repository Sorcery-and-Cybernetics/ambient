_.ambient.module("stacklist.test")
.onload(function(_) {
    _.debug.assertstart("stacklist")

    var stack = _.make.core.stacklist()
    var pushednode = stack.push(10)
    var pushednode = stack.push(20)
    var pushednode = stack.push(30)

    stack.pushfirst(5)

    _.debug.assert(stack.nodefirst().value(), 5, "First node value should be 5")
    _.debug.assert(stack.nodelast().value(), 30, "Last node value should be 30")
    _.debug.assert(stack.count(), 4, "Stack length should be 4")

    var value = stack.pop()
    _.debug.assert(value, 30, "Popped value should be 30")

    value = stack.popfirst()
    _.debug.assert(value, 5, "Popped first value should be 5")


    return _.debug.assertfinish()    
})
