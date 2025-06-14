//*****************************************************************************************************************
// domevent - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

//todo: seperate resize and dragevent 
//todo: hang eventhandlers in dom object. Check on interval if mouse is hovering, or long press.

_.ambient.module("domeventhandler", function(_) {

    _.define.object("domeventhandler", function () {
        var savepagewidth = 0
        var savepageheight = 0

        this.state = null  //control states
        this.rootelement = null

        this.lockcount = 0
        this.focus = null  //Last control that accepted a mousedown.
        this.dragevent = null
        this.mouseevent = null
        this.keyevent = null
        this._mousepointer = ""

        this.create = function (rootelement) {
            this.rootelement = rootelement
            this.state = {}

            var eventhandler = this.handledomevent.bind(this)
            _.dom.defaulteventhandler = eventhandler

            var events = ["keydown", "keyup", "selectstart", "input", "focus"]

            for (key in events) {
                _.dom.addevent(rootelement, events[key], eventhandler)
            }

            var events = ["scroll", "resize", "unload", "change", "click", "touchstart", "touchend", "touchmove", "mouseout", "mousedown", "mouseup", "mouseover", "mousemove", "wheel"]
            for (key in events) {
                _.dom.addevent(window, events[key], eventhandler)
            }
        }

        this.handledomevent = function (domevent) {
            if (!domevent) { domevent = window.event; }
         
            var ctrl = null;
            var element = domevent.target || domevent.srcElement;

            //Global/window events
            switch (domevent.type) {
                case "unload":
                    _.dom.onunload()
                    return
                case "resize":
                    _.dom.update()
                    return

                case "mousemove":
                case "mouseover":
                case "mouseout":
                    break

                default:
                    var x = 10

                //case "mouseover":
                //    _.debug("enter " + element.className)
                //    return

                //case "mouseout":
                //    _.debug("out " + element.className)
                //    return
            }


            //debug
            //switch (domevent.type) {
            //    case "mousemove":
            //        break
            //    default:
            //        //                    _.debug(domevent.type, element? element.nodeName: null)
            //}


            //find control
            var raiseclick;
            var raisedoubleclick

            if (!element || (element == window)) {
                ctrl = _.dom.page
            } else {
                while (element && !(ctrl = _.dom.control(element._uid))) {
                    element = element.parentNode
                }
            }

            var event = _.make.domevent(domevent);
         
            ctrl = this.checkdragevent(ctrl, event)



            switch (domevent.type) {
                case "mousedown":
                case "mouseup":
                    _.dom.lastmouse = _.now()

                    //todo: note - we cannot cancel the event here. Android uses mousedown for textbox focus. 
                    if (_.now() - 500 < _.dom.lasttouch) {
                        return
                    }

                    break
                case "touchstart":
                    event.name = "mousedown"
                    _.dom.lasttouch = _.now()
                    break

                case "touchend":
                    event.name = "mouseup"
                    _.dom.lasttouch = _.now()
                    break

                case "scroll":
                    //todo: Fix scroll
                    var scroller = ctrl

                    while (scroller) {
                        if ((ctrl._behavior & event.behaviortype) || (ctrl.currentstyle.overflow == "scroll") || (ctrl.currentstyle.overflowy == "scroll")) {
                            ctrl.raise("scroll")
                        }
                        scroller = scroller._parent
                    }
                    return

                    //    case "keyup":
                    //    case "keydown":
                    //        break
                    //    default:
                    //        _.debug(domevent.type)
            }


            //find the control with a matching behavior to the current event
            while (ctrl) {
                if ((ctrl.element.style.visibility != "hidden") && (!ctrl.hasclass("disabled"))) {
                    if (!event.behaviortype || (ctrl._behavior & event.behaviortype)) {
                        break;
                    }
                }
                ctrl = ctrl._parent;
            }

            this.setmousepointer(ctrl, event)

            if (_.dom.lockcount > 0) {
                raiseclick = false
                raisedoubleclick = false
            }


            var prevcontrol = event.history.lastcontrol
            event.history.lastcontrol = ctrl? ctrl.uid(): null
                

            if (!ctrl && (!this.dragevent || (this.dragevent.state != _.enum.dragstate.active))) {
                switch (event.name) {
                    case "mouseenter":
                        this.highlight(null, event)
                        ctrl = null
                        break;

                    case "wheel":
                    case "touchend":
                    case "mousedown":
                        this.focus(null, event)
                        break;

                    case "mouseleave":
                        this.highlight(null, event)
                        if (!this.highlight()) {
                            _.dom.mousepointer("default")
                        }
                        break

                    case "keyup":
                    case "keydown":
                    case "keypress":
                        ctrl = this.focus()
                        break

                    case "selectstart":
                        //                        event.cancelbubble = false
                        break
                }
            }

            if (ctrl) {
                switch (event.name) {
                    case "click":
                        //allow for autocomplete, calander, and fileupload
                        if (ctrl.navigateto()) {
                            event.cancelbubble = true
                        }
                        ctrl = null
                        break

                    case "mouseup":
                        //                        if (this.dragevent && (this.dragevent.state == _.enum.dragstate.active)) { return }
                        if (event.currentbutton == 1) {
                            var highlight = this.highlight() || ctrl

                            switch (highlight._behavior & 15) {
                                case _.efb.click: case _.efb.normal:
                                    highlight.setclass("pushed", false)
                            }

                            var mousedownevent = _.domhelper.eventhistory.mousedown
                            var mousemoveevent = _.domhelper.eventhistory.mousemove
                            var mouseupevent = _.domhelper.eventhistory.mouseup


                            if (!mousedownevent) {
                                break
                            }
                            if (mousedownevent.scrolltop !== undefined) {
                                var scrollbox = ctrl.findparentscrollbox()
                                //help with monkey clicks on add action, scrollbox is null     
                                if (scrollbox && Math.abs(scrollbox.element.scrollTop - mousedownevent.scrolltop) > 8) {
                                    break
                                }
                            }


                            if ((mousedownevent.ctrl == ctrl) && (!mouseupevent.timedif || (mouseupevent.timedif >= 50))) {
                                _.debug("timedif", mouseupevent.timedif)
                                
                                //var debuginfo = domevent.type + " - " + ctrl._parent.fulldebugname() + " : " + mousedownevent.ctrl._parent.fulldebugname()
                                //_.dom.debuginfo = debuginfo
                                //_.dom.page.setdirty()

                                var hasmove = mousemoveevent && mousemoveevent.stamp > mousedownevent.stamp
                                var relevantmove = hasmove && (_.distance(mousemoveevent.mouse, event.mouse) > 24)

                                if (!relevantmove) {
                                    if ((mouseupevent.timedif < 400) && (prevcontrol == ctrl.uid())) {
                                        raisedoubleclick = true
                                    } else {
                                        this.focus(ctrl, event)
                                        raiseclick = true
                                    }
                                }
                            }
                        } 
                        break

                    case "mousedown":
                        //                        if (this.dragevent && (this.dragevent.state == _.enum.dragstate.active)) { return }
//                        this.focus(ctrl, event)
                        if (event.currentbutton == 1) {
                            if (ctrl && event.history) {
                                var scrollbox = ctrl.findparentscrollbox()

                                if (scrollbox) {
                                    event.history.scrolltop = scrollbox.element.scrollTop
                                }
                                event.history.ctrl = ctrl
                            }

                            var highlight = this.highlight() || ctrl

                            switch (highlight._behavior & 15) {
                                case _.efb.click: case _.efb.normal:
                                    highlight.setclass("pushed", true)
                            }
                        }

                        //                        if (ctrl._behavior & _.efb.capturekeys) { event.cancelbubble = false }
                        break

                    case "mouseenter":
                        //                        if (this.dragevent && (this.dragevent.state == _.enum.dragstate.active)) { return }
                        this.highlight(ctrl, event)
                        ctrl = null
                        break

                    case "mouseleave":
                        //                        if (this.dragevent && (this.dragevent.state == _.enum.dragstate.active)) { return }

                        //                        this.highlight(null, event)
                        ctrl = null
                        break

                    case "mouseover":
                        break

                    case "selectstart":
                        event.cancelbubble = false
                        break

                    case "keydown":
                        switch (event.key) {
                            case "ctrl": case "alt": case "shift":
                                break
                            default:
                                event.raise(ctrl, "keypress")
                        }
                        break

                    case "focus":
                        this.focus(ctrl, event)
                        event.cancelbubble = false
                        break

                }
            }


            if (ctrl) {
                //event.source = ctrl
                //ctrl.raise(event);
                event.raise(ctrl, event.name) 

                if (raiseclick) {
                    ctrl.setchecked()
                    //this breaks mobile selection of inputboxes
                    //event.cancelbubble = true
                } else if (raisedoubleclick) {
                    ctrl.ondoubleclick(event)
                }
            }

            if (event.cancelbubble || this.dragevent) {
                domevent.stopPropagation()
                domevent.preventDefault()
                return false
            }
        }

        this.checkdragevent = function (ctrl, event) {
            var dragevent = this.dragevent

            if (!dragevent) {
                var mousedrag = ctrl

                while (mousedrag) {
                    if ((mousedrag.style.visibility != "hidden") && (!mousedrag.disabled())) {
                        if (mousedrag._behavior & (_.efb.drag | _.efb.scroll | _.efb.size)) {

                            var dragevent = _.make.dragevent(mousedrag, "", event)
                            break;
                        }
                    }
                    mousedrag = mousedrag._parent
                }

            } else {
//                dragevent.update(event)

                switch (event.name) {
                    case "mousemove":
                        dragevent.mousemove(event)

                        if (dragevent.state == _.enum.dragstate.start) {
                            dragevent.raise(dragevent.source, "dragstart")
                            if (!dragevent.cancel) {
                                dragevent.state = _.enum.dragstate.active
                            }
                        }

                        if (dragevent.state == _.enum.dragstate.active) {
                            dragevent.raise(dragevent.source, "drag")


                            if (dragevent.state == _.enum.dragstate.active) {
                                if (dragevent.mod.y || dragevent.mod.x) {
                                    if (dragevent.selectedborder || dragevent.automove) {
                                        dragevent.calc(dragevent.mod.x, dragevent.mod.y)
                                        dragevent.dragroot.outerrect(dragevent.newpos)
                                    } else {
                                        var el = dragevent.source.element
                                        el.scrollLeft = dragevent.newpos.x
                                        el.scrollTop = dragevent.newpos.y
                                    }
                                }
                            }
                            ctrl = null;
                        }

                        if (dragevent.automove) {
                            var elements = _.dom.elementsfrompoint(dragevent.mouse.x, dragevent.mouse.y)
                            elements = _.filter(elements, function (control) { return control.behavior() & _.efb.drop })

                            var dragroot = dragevent.source.dragroot || dragevent.source
                            var droptarget = null
                            do {
                                droptarget = elements.pop()
                            } while (droptarget && ((dragroot == droptarget) || droptarget.hasancestor(dragroot)))

                            //while (droptarget && elements) {
                            //    if (dragroot == droptarget) {
                            //        droptarget = null
                            //    } else if () {
                            //        droptarget = elements.pop()
                            //    } else {
                            //        break
                            //    }
                            //}

                            if ((dragevent.state > 1) && (droptarget != dragevent.droptarget)) {
                                if (dragevent.droptarget) {
                                    dragevent.raise(dragevent.source, "dragleave")
                                    dragevent.raise(dragevent.droptarget, "dragleave")
                                    dragevent.droptarget = null
                                    dragevent.nodrop = false
                                }
                            }

                            if (droptarget) {
                                dragevent.nodrop = false

                                if (!dragevent.droptarget) {
                                    dragevent.droptarget = droptarget
                                    dragevent.raise(dragevent.source, "dragenter")
                                    dragevent.raise(dragevent.droptarget, "dragenter")
                                }

                                dragevent.raise(dragevent.droptarget, "dragover")
                            }
                            ctrl = null
                        }
                        break;

                    case "mouseup":
                        if (dragevent.state == _.enum.dragstate.active) {
                            if (dragevent.droptarget) {
                                dragevent.raise(dragevent.droptarget, "drop")
                                dragevent.raise(dragevent.source, "drop")
                            }
                            //var oldstate = dragevent.state
                            dragevent.raise(dragevent.source, "dragleave")
                            if (dragevent.droptarget) { dragevent.raise(dragevent.droptarget, "dragleave") }

                            dragevent.state = _.enum.dragstate.ended
                            dragevent.raise(dragevent.source, "dragend")

                            //if (oldstate == _.enum.dragstate.active) {
                            //    if (dragevent.selectedborder || dragevent.automove) {
                            //        dragevent.calc(dragevent.mod.x, dragevent.mod.y)
                            //        dragevent.dragroot.outerrect(dragevent.newpos)
                            //    } else {
                            //        var el = dragevent.source.element
                            //        el.scrollLeft = dragevent.newpos.x
                            //        el.scrollTop = dragevent.newpos.y
                            //    }
                            //}


                            dragevent.droptarget = null

                            event.cancelbubble = true
                            ctrl = null
                        }
                        dragevent = null
                        break;

                    default: ctrl = null
                }
            }

            if (dragevent && dragevent.cancel) {
                if (dragevent.state == _.enum.dragstate.active) {
                    if (dragevent.droptarget) {
                        dragevent.raise(dragevent.droptarget, "dragleave")
                        dragevent.droptarget = null
                    }
                    dragevent.name = "dragend"
                    dragevent.source.raise(dragevent, "dragend")
                }
                dragevent = null
            }
            this.dragevent = dragevent
            return ctrl
        }

        this.setmousepointer = function (ctrl, event) {
            var pointer = null

            if (_.dom.lockcount > 0) {
                //todo: what mousepointer do we have here?
            } else {
                if (this.dragevent) {

                    if (this.dragevent.source._behavior & _.efb.size) {
                        pointer = _.dom.resizepointer(this.dragevent.selectedborder)
                    }

                    if (!pointer) {
                        pointer = this.dragevent.source.currentstyle.cursor || "default"

                        if ((this.dragevent.source._behavior & _.efb.drag) && this.dragevent.state) {
                            if (this.dragevent.droptarget) {
                                if (this.dragevent.state < _.enum.dragstate.active) {
                                    pointer = "move"
                                } else if (this.dragevent.droptarget) {
                                    pointer = "alias"
                                } else {
                                    pointer = "help"
                                }
                            } else if (this.dragevent.nodrop) {
                                pointer = "no-drop"
                            } else {
                                //pointer = "move"
                            }
                        } else if (this.dragevent.source._behavior & _.efb.click) {
                            pointer = "pointer"
                        }
                    }

                    if (!this.dragevent.state) {  //We only needed the this.dragevent to set the mouse pointer
                        this.dragevent = null
                    }

                } else if (event.name == "mouseenter" || (event.name == "mouseup")) {
                    if (!ctrl) {
                        pointer = "default"
                    } else {
                        var pointer = ctrl.currentstyle.cursor
                        if (pointer == "default" || pointer == "" || pointer == "inherit") {
                            pointer = null

                            if (ctrl._behavior & _.efb.capturekeys) { pointer = "text" }
                            else if (ctrl._behavior & _.efb.click) { pointer = "pointer" }
                        }
                    }
                }
            }

            if (pointer) {
                _.dom.mousepointer(pointer)
            }
        }

        this.highlight = function (ctrl, domevent) {
            if (ctrl === undefined) {
                return this.state.highlight
            } else {
                if (this.state.highlight != ctrl) {
                    this.setcontrolselectionstate(ctrl, domevent, "highlight", "mouseenter", "mouseleave", true)
                }
            }
        }

        this.focus = function (ctrl, domevent) {
            if (ctrl === undefined) {
                return this.state.focus

            } else {
                if (this.state.focus != ctrl) {
                    //todo: should focus bubble?
                    this.setcontrolselectionstate(ctrl, domevent, "focus", "focus", "blur", true)

                    if (ctrl && ctrl.element) {
//                        _.debug("setfocus", ctrl.fullname())
                        ctrl.setfocus()
                    }
                }
            }
        }

        this.setcontrolselectionstate = function (ctrl, domevent, selectionname, eventname, uneventname, bubble) {
            var target = this.state[selectionname];
            var commonancestor = ctrl ? ctrl.findsharedancestor(target, "related") : null

            var event = _.make.event(target, uneventname)
            event.domevent = domevent
            event.fromelement = target
            event.toelement = ctrl

            //Hack: Set the full controlpath to dirty, even if the state doesnt change. Otherwise there is a chance not all effected children within nested controls get repainted
            while (target) {
                if (target == commonancestor) { break }

                target[selectionname] = false  //todo: remove
                target.setclass(selectionname, false)
                event.target = target

                if (!event.cancel) {
                    event.raise(target, uneventname)
                }
                target = bubble ? target.getrelation("related") : null
            }

            //todo: in reverse order set the new state
            event.name = eventname
            event.source = ctrl

            target = ctrl

            this.state[selectionname] = ctrl

            while (target) {
                target[selectionname] = true //todo: remove
                target.setclass(selectionname, true)

                if (!event.cancel) {
                    event.raise(target, eventname)
                }
                target = bubble ? target.getrelation("related") : null
            }
        }
    })
})
.onload(function () {
    //todo: hang eventhandlers in dom object. Check on interval if mouse is hovering, or long press.

    _.dom.domevents = _.make.domeventhandler(document.body)
})
