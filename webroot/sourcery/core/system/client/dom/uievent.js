//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

//todo: We need to track text selection better. This also means that controls should a selectable state.

_.ambient.module("uievent", function(_) {

    //todo: Is this still valid? Is this the right file?
    // _ec = -1

    // _.estate = {
    //     unloaded: _ec++
    //     , none: _ec++
    //     , created: _ec++
    //     , showed: _ec++
    //     , hidden: _ec++
    // }


    _.enum.uievent = {
        "click": { name: "click", behaviortype: _.efb.click }
        , "mouseover": { name: "mouseenter", behaviortype: _.efb.highlight }
        , "mouseout": { name: "mouseleave", behaviortype: _.efb.highlight }
        , "mouseup": { name: "mouseup", behaviortype: _.efb.click | _.efb.drag | _.efb.scroll, cancelbubble: false }
        , "mousedown": { name: "mousedown", behaviortype: _.efb.click | _.efb.drag | _.efb.scroll, cancelbubble: false }
        , "mousemove": { name: "mousemove", behaviortype: _.efb.mousemove | _.efb.drag | _.efb.scroll, cancelbubble: false }
        , "touchstart": { name: "mousedown", behaviortype: _.efb.click | _.efb.drag | _.efb.scroll, cancelbubble: false, istouch: true }
        , "touchend": { name: "mouseup", behaviortype: _.efb.click | _.efb.drag | _.efb.scroll, cancelbubble: false }
        , "touchmove": { name: "mousemove", behaviortype: _.efb.mousemove | _.efb.drag | _.efb.scroll, cancelbubble: false }
        , "wheel": { name: "wheel", behaviortype: _.efb.highlight | _.efb.wheel, cancelbubble: false }
        , "focus": { name: "focus", behaviortype: _.efb.click | _.efb.capturekeys }
        , "blur": { name: "blur", behaviortype: _.efb.click | _.efb.capturekeys }
        , "select": { name: "select", behaviortype: _.efb.click }
        , "change": { name: "change", behaviortype: _.efb.change | _.efb.capturekeys }
        , "resizable": { name: "resizable", behaviortype: _.efb.resizable, cancelbubble: false }
        , "keydown": { name: "keydown", behaviortype: _.efb.capturekeys, cancelbubble: false }
        , "keypress": { name: "keypress", behaviortype: _.efb.capturekeys, cancelbubble: false }
        , "keyup": { name: "keyup", behaviortype: _.efb.capturekeys, cancelbubble: false }
        , "input": { name: "input", behaviortype: _.efb.capturekeys, cancelbubble: false }
        , "selectstart": { name: "selectstart", behaviortype: _.efb.capturekeys, cancelbubble: false }
    }

    _.define.event("uievent", function () {
        _.dom.keycodes = (function () {
            var result = []
            var index

            //0-9 and a-z
            for (index = 48; index <= 90; index++) {
                result[index] = _.chr$(index).toLowerCase();
            }

            for (index = 1; index <= 12; index++) {
                result[111 + index] = "f" + index;
            }

            //numpad codes are from 96 to 111
            for (index = 0; index <= 9; index++) {
                result[96 + index] = index
            }

            var codes = _.split$("8|backspace|tab|13|enter|16|shift|ctrl|alt|pause/break|capslock|27|escape|32|space|pageup|pagedown|end|home|left|up|right|down|45|insert|delete|91|windowkey|windowkey|selectkey|106|*|+|-|.|/|144|numlock|scrolllock|186|;|=|,|-|.|/|`|219|[|\\|]|'", "|")

            var keycode = 0
            for (index = 0; index < codes.length; index++) {
                var code = codes[index]

                if (_.isnumeric(code)) {
                    keycode = _.cint(code)
                } else {
                    result[keycode] = code
                    keycode++
                }
            }
            return result
        }) ()


        this.uievent = ""
        this.behaviortype = _.efb.none
        this.cancelbubble = false
        this.keycode = 0
        this.key = 0
        this.ctrlkey = false
        this.altkey = false
        this.shiftkey = false
        this.button = 0

        this.mouse = null
        this.history = null
            
        this.create = function (source, event) {
            this._source = source

            var touch = (event.originalEvent ? event.originalEvent.touches : event.touches) || []

            var eventdef = _.enum.uievent[event.type] || { name: event.type, behaviortype: _.efb.none }
            var mouseinfo = touch[0] || event

            //Normalizing button detection to 1: left, 2: right, 4: middle. This allows detection of button combinations.
            //During mousemove browsers forget which button is pressed, and for extra fun IE 11 sets event.which = 1 when no button is pressed
            //dom.lastmousebutton remembers last pressed button and will add this to the event
            switch (event.type) {
                case "touchstart":
                    this.currentbutton = 1
                    _.dom.lastmousebutton |= this.currentbutton
                    break

                case "touchend":
                    this.currentbutton = 1
                    _.dom.lastmousebutton &= ~this.currentbutton
                    break

                case "mousedown":
                    this.currentbutton = [0, 1, 4, 2][event.which || event.button + 1]
                    _.dom.lastmousebutton |= this.currentbutton
                    break

                case "mouseup":
                    this.currentbutton = [0, 1, 4, 2][event.which || event.button + 1]
                    _.dom.lastmousebutton &= ~this.currentbutton
                    break

                case "wheel":
                    this.wheel = {
                        x: event.deltaX
                        , y: event.deltaY
                        , z: event.deltaZ
                        , mode: event.deltaMode
                    }
                    break
            }

            this._name = eventdef.name || event.type
            this.uievent = event.type
            this.behaviortype = eventdef.behaviortype || _.efb.none
            this.cancelbubble = eventdef.cancelbubble != null ? eventdef.cancelbubble : false

            //todo: Understand what is happening here. The && is weird
            if (_.domhelper.eventhistory["mousedown"] && _.domhelper.eventhistory["mousedown"].istouch && (this.name == "mouseup")) {
                //Pretend there is no mouse movement on a click
                this.mouse = _.clone(_.domhelper.eventhistory["mousedown"].mouse)
            } else {
                this.mouse = {
                    x: ((mouseinfo.pageX || mouseinfo.clientX ) / (_.dom.zoomfactor * _.dom.pixelratio)) - _.dom.bodyleft()  + (_.dom.scrollx / _.dom.pixelratio)
                    , y: ((mouseinfo.pageY || mouseinfo.clientY) / (_.dom.zoomfactor * _.dom.pixelratio)) - _.dom.bodytop() + (_.dom.scrolly / _.dom.pixelratio)
                }
            }

            //Todo: Cross browser scrollposition of the page
            //window.pageYOffset != null ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
            this.keycode = event.keyCode
            this.key = _.dom.keycodes[event.keyCode]
            this.ctrlkey = event.ctrlKey
            this.altkey = event.altKey
            this.shiftkey = event.shiftKey
            this.button = _.dom.lastmousebutton

            var history = {
                button: this.button
                , mouse: {
                    x: this.mouse.x
                    , y: this.mouse.y
                }
                , istouch: !!touch[0]
                , stamp: _.now()
                , key: this.key
                , keycode: this.keycode
            }

            this.history = history

            switch (this.name) {
                case "mousedown":
                case "mouseup":
                case "mousemove":
                    var prevhistory = _.domhelper.eventhistory[this.name]

                    if (prevhistory) {
                        history.timedif = (history.stamp - prevhistory.stamp)
                        history.lastcontrol = prevhistory.lastcontrol
                    } 
                    
                    _.domhelper.eventhistory[this.name] = history
                    break
            }

            _.dom.mouse = {
                x: this.mouse.x
                , y: this.mouse.y
            }
        }


        //todo:
        // this.getrelativemouse = function (ctrl) {
        //     ctrl = ctrl || _.dom.page
        //     return _.make.rect(this.mouse.x, this.mouse.y).possub(ctrl.absoluteouterrect())
        // }    
    })
})
