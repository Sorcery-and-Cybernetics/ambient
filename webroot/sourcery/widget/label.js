_.define.control("label", function () {
    return {
        halign: _.property("left")
        , valign: _.property("top")
        , ellipsis: _.property(false)
       
        , onload: function () {
            if (this.ellipsis()) {
                this.css({"textoverflow": "ellipsis", "whitespace": "nowrap"})
            }
        //   else {
        //        this.css({ "textoverflow": "", "whitespace": "" })
        //    }
        }

        , ondraw: function () {
            var value

            this.css({
                textalign: this.halign()
            })

            if (this.element) {
                value = _.escape$(this.value()) || ""
                value = _.replace$(value, _.crlf, "<br>")
                this.element.innerHTML = value
            }

            if (this.outerheight()) {
                var lineheight = this.currentstyle.lineheight || this.currentstyle.fontsize*1.2 || _.config.ui.fontsize.normal*1.2
                var paddingtop

                switch (_.lcase$(this.valign())) {
                    case "bottom":
                        paddingtop = this.outerheight() - lineheight - this.currentstyle.paddingbottom //= this.style().paddingtop()
                        break

                    case "center":
                    case "middle":
                        paddingtop = (this.outerheight() - lineheight) / 2
                        break

                    default:
                }

                this.css({
                    paddingtop: (paddingtop || 0)
                })
            }
        }

        //todo: replace with new state property definition
        //, ondomcreate: function () {
        //    this.element.innerHTML = this.value()
        //}

        ////todo: replace with new state property definition
        //, value: _.property("")
        //    .onset(function (value) {
        //        if (this.element) {
        //            this.element.innerHTML = value
        //        }
        //    })

//        , value: _.styleproperty("html")

    }
})


_.define.control("code", function () {
    return {
        halign: _.property("left")
        , valign: _.property("top")
        , ellipsis: _.property(false)
        , tagname: "CODE"
        , onload: function () {
            if (this.ellipsis()) {
                this.css({ "textoverflow": "ellipsis", "whitespace": "nowrap" })
            } else {
                this.css({ "textoverflow": "", "whitespace": "" })
            }
        }

        , ondraw: function () {
            var value

            this.css({
                textalign: this.halign()
            })

            if (this.element) {
                value = _.escape$(this.value()) || ""
                value = _.replace$(value, _.crlf, "<br>")
                this.element.innerHTML = value
            }

            if (this.outerheight()) {
                var lineheight = this.currentstyle.lineheight || this.currentstyle.fontsize * 1.2 || _.config.ui.fontsize.normal * 1.2
                var paddingtop

                switch (_.lcase$(this.valign())) {
                    case "bottom":
                        paddingtop = this.outerheight() - lineheight - this.currentstyle.paddingbottom //= this.style().paddingtop()
                        break

                    case "center":
                    case "middle":
                        paddingtop = (this.outerheight() - lineheight) / 2
                        break

                    default:
                }

                this.css({
                    paddingtop: (paddingtop || 0)
                })
            }
        }

        //todo: replace with new state property definition
        //, ondomcreate: function () {
        //    this.element.innerHTML = this.value()
        //}

        ////todo: replace with new state property definition
        //, value: _.property("")
        //    .onset(function (value) {
        //        if (this.element) {
        //            this.element.innerHTML = value
        //        }
        //    })

        //        , value: _.styleproperty("html")

    }
})
