//todo: See if focus behavior (for regular mouse actions) can be removed and how much impact it has on performance
//todo: dragevent.automove should become dragevent.behavior. Behavior is (optionally) a function

//############################################################################################################################################
//Dom
//############################################################################################################################################



_.define.module("dom", function () {
    _.eam = {
        lastchild: 0
        , firstchild: 1
        , after: 2
        , before: 3
        , dom: 4
    }

    _.environ = {
        istouch: ("createTouch" in document)
        , button: 0
    }

    _.clientdb = _.make.aliasroot().ismaster(true)


    _.dom = {
        isdirty: false

        , defaulteventhandler: null
        , mouse: null
        , scrollx: 0
        , scrolly: 0
        , width: 0
        , height: 0
        , zoomfactor: 1

        , controlfocus: null
        , controlhighlight: null

        , programwidth: 0
        , programheight: 0

        , lockcount: 0
        , lockscreencount: 0
        , locks: {}

        , tychcount: 0
        , tychwidth: _.config.ui.layout.tychwidth || 312
        , tychmax: _.config.ui.layout.tychmax || 1
        , tychmin: _.config.ui.layout.tychmin || 1
        , tychtreshold: _.config.ui.layout.tychtreshold || 1
        , tychcountadjust: _.config.ui.layout.tychcountadjust || 0

        , maxcontentcolumns: _.config.ui.layout.maxcontentcolumns || 2
        , getmaxcontentwidth : function () {
            return _.dom.tychwidth * _.dom.maxcontentcolumns
        }
        , pixelratio: _.config.ui.layout.pixelratio || 1

//        , programminheight: 

        , savepagewidth: 0
        , savepageheight: 0

        , lasttouch: 0
        , lastmouse: 0

        , domevents: null
        , meta: null

        , debuginfo: ""

        , oncreate: function () {
            // 
        }

        //        , controls: {}
        , update: function (noevent, force) {
            var me = _.dom
            var forceredraw = false //true //hack for tychpanel updates

            me.width = me.pagewidth()
            me.height = me.pageheight()
            me.scrollx = me.scrollleft()
            me.scrolly = me.scrolltop()
            _.debug("dom.update.resize:" + me.width + "." + me.height)
            if ((me.width != me.savepagewidth) || (me.height != me.savepageheight) || (me.saveorientation != me.orientation()) || force) {
                me.savepagewidth = me.width
                me.savepageheight = me.height
                me.saveorientation = me.orientation()

                var tychcount = _.floorto(me.width / (me.tychwidth * me.tychtreshold), 1)
                tychcount = _.limitbetween(tychcount, me.tychmin, me.tychmax) + me.tychcountadjust
                tychcount = _.limitbetween(tychcount, me.tychmin, me.tychmax)
                _.debug("dom.update.tychcount:" + tychcount)

                if (tychcount != me.tychcount) {
                    forceredraw = true
                    me.tychcount = tychcount
                    var newpagewidth = me.tychcount * me.tychwidth

                    me.programwidth = newpagewidth
                    me.programheight = 0

//                    me.page.rescale = true
//                    me.oncolumnchange()
                }

                //todo: chrome sends a resize event during pageload. 
                //                            this.setfocus(null)
                if (!noevent && _.dom.page) {
                    _.dom.page.raise("resize", null, { force: forceredraw })
                }
            }
        }

        , onload: function (fn) {
            _.loader.onload(fn)
        }

        , findprefixedmethod: function (functionname, context, prefixes) {
            prefixes = prefixes || ["", "ms", "webkit", "moz", "o"]
            var context = context || window

            for (var index = 0; index < prefixes.length; index++) {
                var prefix = prefixes[index]

                var testname = prefix ? prefix + _.capitalize(functionname) : functionname
                if (context[testname] !== undefined) {
                    return testname
                }
            }
            return null
        }

        , polyfillfunction: function (functionname, context) {
            context = context || window
            if (context[functionname]) { return }
            context[functionname] = context[_.dom.findprefixedmethod(functionname, context)]
        }

        , findid: function (name) {
            return document.getElementById(name)
        }

        , findclass: function (name) {
            //Todo: find by classname
        }

        , orientation: function () {
            return (this.pagewidth() >= (this.pageheight())) ? "landscape" : "portrait"
        }
        , bodyleft: function () {
            return _.dom.page? _.dom.page.currentstyle.left: 0
        }
        , bodytop: function () {
            return _.dom.page? _.dom.page.currentstyle.top: 0
        }

        , pagewidth: function () {  
           // var scale = (typeof visualViewport != "undefined") ? window.visualViewport.scale : 1
            return document.documentElement.clientWidth
            //return document.documentElement.clientWidth || (window.innerWidth * window.visualViewport.scale)
            //old: document.body.offsetWidth || window.innerWidth || document.documentElement.clientWidth;

            //maybe better? window.innerWidth && document.documentElement.clientWidth ?
            //Math.min(window.innerWidth, document.documentElement.clientWidth) :
            //window.innerWidth ||
            //document.documentElement.clientWidth ||
            //document.getElementsByTagName('body')[0].clientWidth;
        }

        , pageheight: function () {
            //var scale = (typeof visualViewport != "undefined")? window.visualViewport.scale : 1
            return document.documentElement.clientHeight
            //return document.documentElement.clientHeight || (window.innerHeight * window.visualViewport.scale)
            //return document.body.clientHeight || document.body.offsetHeight || window.innerHeight || document.documentElement.clientHeight;
        }
        
        , devicepixels: function () {
            return 0
        }

        //Todo: Add scroll position of elements to virtual dom.
        , scrollleft: function (element, value) {
            if (value === undefined) {
                if (element && element != _.dom.page) { return element.scrollLeft / _.dom.pixelratio }
                return window.pageXOffset //|| document.documentElement.scrollLeft || document.body.scrollLeft || 0
            }

            if (element && element != _.dom.page) {
                element.scrollLeft = value
            } else {
                //
            }
            return element
        }

        , scrolltop: function (element, value) {
            if (value === undefined) {
                if (element && element != _.dom.page) { return element.scrollTop / _.dom.pixelratio }
                return window.pageYOffset //|| document.documentElement.scrollTop || document.body.scrollTop || 0
            }

            if (element && element != _.dom.page) {
                element.scrollTop = value
            } else {
                //
            }

            return element
        }

        , scrollposition: function(element) {
            return _.make.rect.create(_.dom.scrollleft(element), _.dom.scrolltop(element), 0, 0)
        }

        , scrollwidth: function (element) {
            return element ? element.scrollWidth / _.dom.pixelratio : 0
        }

        , scrollheight: function (element) {
            return element ? element.scrollHeight / _.dom.pixelratio : 0
        }

        , performancetimer: null  //implementation will follow after _.dom is initialized
        , immediate: null   //implementation will follow after _.dom is initialized

        , delay: function (delay, next) {
            return setTimeout(next, delay)
        }

        , canceldelay: function (timerid) {
            clearTimeout(timerid)
        }

        , addevent: function (element, eventname, eventhandler) {
            element.addEventListener(eventname, eventhandler || this.defaulteventhandler, true)
        }

        , removeevent: function (element, eventname, eventhandler) {
            element.removeEventListener(eventname, eventhandler || this.defaulteventhandler, true)
        }

        , createelement: function (tag, tagtype, namespace) {
            if (_.iselement(tag)) {
                var element = tag
            } else {
                if (namespace) {
                    var element = document.createElementNS(namespace, tag)
                } else {
                    var element = document.createElement(tag)
                }
            }
            if (tagtype) {
                element.setAttribute("type", tagtype)
            }
            return element
        }

        , appendelement: function (element, relative, appendmode) {
            relative = relative || document.body
            appendmode = appendmode || _.eam.lastchild

            switch (appendmode) {
                case _.eam.lastchild:
                    relative.appendChild(element)
                    break
                case _.eam.firstchild:
                    if (!relative.firstChild) {
                        relative.appendChild(element)
                    } else {
                        relative.insertBefore(element, relative.firstChild)
                    }
                    break
                case _.eam.after:
                    if (relative.nextSibling) {
                        relative.parentNode.insertBefore(element, relative.nextSibling)
                    } else {
                        relative.parentNode.appendChild(element)
                    }
                    break
                case _.eam.before:
                    relative.parentNode.insertBefore(element, relative)
                    break
            }
            return element
        }

        , removeelement: function (element) {
            if (element.uniqueid) { delete elements[element.uniqueid] }
            if (!element.parentNode) {
                _.debug("Element doesn't exist")
            } else {
                element.parentNode.removeChild(element)
            }
            return null
        }

        , registeredcontrols: {} //Contains the link between elements and control classes
        //        , controls: _.make.dictionary.create("name", false, true, this) //Root controls

        , registercontrol: function (control) {
            if (_.clientdb) {
                _.clientdb.setnode(control)
            } else {
                control._uid = control._uid || _.uniqueid()
                this.registeredcontrols[control._uid] = control
            }
            if (control.element) { control.element._uid = control._uid }
        }

        , unregistercontrol: function (control) {
            if (control.element) { control.element._uid = undefined }

            if (_.clientdb) {
                _.clientdb.delnode(control)
            } else {
                control._uid = undefined
                delete this.registeredcontrols[id]
            }
            return null
        }

        , control: function (uid) {
            if (_.clientdb) {
                return _.clientdb.getnode(uid)
            } else {
                return this.registeredcontrols[uid]
            }
        }

        , focus: function (ctrl) {
            return this.domevents? this.domevents.focus(ctrl): null
        }

        , highlight: function (ctrl) {
            return this.domevents ? this.domevents.highlight(ctrl) : null
        }

        , findcontrol: function (controlpath) {
            return this.page ? this.page.findcontrol(controlpath) : null
        }

        , elementsfrompoint: (function () {
            var cachex = null
            var cachey = null
            var cache = null

            return function (x, y) {
                if ((x == cachex) && (y == cachey) && (cache)) {
                    return cache
                }
                return cache = _.dom.page.elementsfrompoint(x, y)
            }
        })()

        , mousepointer: function (value) {
            if (value !== undefined) {
                //            if (this._mousepointer == value) { return }
                this._mousepointer = value

                _.immediate(function () {
                    var pointer = _.dom.mousepointer()

                    document.body.style.cursor = pointer

                    //todo: Why setting cursor here also???? 
                    var highlight = _.dom.highlight()

                    if (highlight) {
                        highlight.css({ cursor: pointer })
                    }
                })
                return this
            } else {
                return this.lockcount > 0 ? "wait" : _.dom._mousepointer
            }
        }

        , getmouseposition: function (ctrl) {
            if (!_.dom.mouse) { return null }
            ctrl = ctrl || _.dom.page
            return _.make.rect(_.dom.mouse.x, _.dom.mouse.y).possub(ctrl.absoluteouterrect())
        }

        , resizepointer: function (hitarea) {
            var pointer = ""

            switch (hitarea) {
                case _.area.left | _.area.top:
                case _.area.right | _.area.bottom:
                    pointer = "nw-resize"; break;
                case _.area.left | _.area.bottom:
                case _.area.right | _.area.top:
                    pointer = "ne-resize"; break;
                case _.area.left:
                case _.area.right:
                    pointer = "ew-resize"; break;
                case _.area.top:
                case _.area.bottom:
                    pointer = "ns-resize"; break;
                default:
                    pointer = ""; break;
            }

            return pointer
        }

        , lock: function () {
            if (this.lockcount == 0) {
                var save = this._mousepointer
                _.dom.mousepointer("wait")
                this._mousepointer = save
            }
            this.lockcount++
        }

        , unlock: function () {
            if (this.lockcount > 0) {
                this.lockcount--
            }

            if (this.lockcount == 0) {
                _.dom.mousepointer(this._mousepointer)
            }
        }

        , lockscreen: function (control) {
            if (!this.locks[control.uid()]) {
                this.locks[control.uid()] = true
                this.lockscreencount += 1

                if (this.lockscreencount == 1) {
                    if (!_.dom.page.overlay) {
                        _.make.overlay(_.dom.page, "overlay")
                            .move(0, 0, "", "", 0, 0)
                    }
                }
            }
        }

        , unlockscreen: function (control) {
            if (this.locks[control.uid()]) {
                delete this.locks[control.uid()]
                this.lockscreencount -= 1

                if (this.lockscreencount == 0 && _.dom.page.overlay) {
                    _.dom.page.overlay.destroy()
                }
            }
        }

        , ismobile: function () {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        }

        , isfullscreen: function () {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                return true
            }
            return document.fullscreenElement 
        }

        , togglefullscreen: function (toggle) {
            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                requestFullScreen.call(docEl);
            }
            else {
                if (!toggle) {
                    cancelFullScreen.call(doc);
                }
            }

        }

        , setdirty: function () {
            var me = this

            if (me.dirty) { return }
            me.dirty = true

            function paint() {
                me.dirty = false

                me.onrender()

                if (_.dom.page.fpstimer) { _.dom.page.fpstimer.timingstart() }
                _.dom.page.paint()

                if (_.dom.page.fpstimer) { _.dom.page.fpstimer.timingend() }
            }
            _.dom.performancetimer(paint)
        }

        , iscrapos: function() {
            return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        }

        , onrender: _.signal().define(null, "onrender")
        , onunload: _.signal().define(null, "onunload")
        , onscroll: _.signal().define(null, "onscroll")
        , onresize: _.signal().define(null, "onresize")
    }

    _.dom.performancetimer = (function () {
        var timer = _.dom.findprefixedmethod("requestAnimationFrame")
        return timer ? function (next) { requestAnimationFrame(next) } : function (next) { setTimeout(next, 16.666) }
    })()

    //_.immediate = (function () {
    //    var immediate = _.dom.findprefixedmethod("setImmediate")
    //    return immediate ? function (next, scope) { return setImmediate(next, scope) } : _.immediate } 
    //)()
  
    //_.immediate(function domloader() {
    //    if (document.body) {
    //        _.dom.onload()
    //        //_.dom.raise("domload")
    //    } else {
    //        _.immediate(domloader)
    //    }
    //})


})
.onload(function () {
    if (!document.body) {
        _.debug.error(_.dom, "onload", arguments, "document.body is missing")
    }
    _.dom.update(true)

    _.dom.meta = _.make.meta()
    //Initialize application

    _.dom.onunload(function () {
        if (_.dom.page) { _.dom.page.destroy() }
    })

})
