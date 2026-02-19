//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

_.ambient.module("clientmain")
.onload(function(_) {
    _.debug("Clientmain is loaded")
    _.window = _.model.widgetwindow().connect(_.htmldocument)

    var windowbody = _.model.widget("windowbody")

    var widget = _.model.widget("testwidget")
    widget._uid = 99
    widget.assignto(_.window, "testwidget")
    widget.text("Hello World. This is a test.")
    widget.onclick(function() {
        alert("Clicked")
    })
    widget.move(100, 100, 300, 35)
    widget.colorfore("green")
    widget.colorback("#BBB")
    widget.setborder(_.area.all, "black", 1)
    widget.show()
    widget.render()
})
