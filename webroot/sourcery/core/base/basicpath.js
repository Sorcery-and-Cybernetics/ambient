//*************************************************************************************************
// basicpath - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicpath", function (_) {
    _.path = _.path || {}

    _.path.isdir$ = function (path) {
        path = _.cstr(path)
        return (path.substr(path.length - 1) == "/")
    }

    _.path.normalize = function (path) {
        var path = (path || "").replace(/\\/g, "/")

        var splitted = path.split("/")
        var result = []

        while (splitted.length) {
            segment = splitted.shift()

            switch (segment) {
                case ".":
                    break
                case "..":
                    if (!result.length) {
                        result.push(segment)
                    } else {
                        var lastsegment = result[result.length - 1]

                        switch (lastsegment) {
                            case "":
                            case "..":
                            case ".":
                                result.push(segment)
                                break

                            default:
                                result.pop()
                        }
                    }
                    break
                default:
                    result.push(segment)
            }
        }

        return result.join("/")
    }

    _.path.getname = function (url) {
        return _.path.splitpath(url).name
    }
    _.path.getextension = function (url) {
        return _.path.splitpath(url).extension
    }

    _.path.getdrive = function (url) {
        return _.path.splitpath(url).drive
    }

    _.path.getpath = function (url) {
        var path = _.path.splitpath(url)
        return path.path + (path.isdir ? (path.name + "/") : "")
    }

    //Todo: Implement http url split, split scheme
    //Todo: shorten routine or use regex
    _.path.splitpath = function (url, result) {
        result = result || {}

        if (!url) {
            //result.scheme = ""
            //result.host = ""
            //result.port = ""
            //result.user = ""
            //result.pass = ""
            //result.path = ""
            //result.query = ""
            //result.fragment = ""

            result.isdir = false
            result.name = ""
            result.path = ""
            result.drive = ""
            result.extension = ""
            return result

        } else {
            //todo: use regexer....
            if (_.right$(url, 1) == "/") {
                result.isdir = true
                url = _.left$(url, -1)
            } else {
                result.isdir = false
            }

            var splitted = _.kvsplit$(url, "/", true)
            if (!splitted.value) {
                result.path = ""
                url = splitted.key
            } else {
                result.path = splitted.key
                if (result.path) { result.path += "/" }
                url = splitted.value
            }

            if (result.isdir) {
                result.name = url
            } else {
                var splitted = _.kvsplit$(url, ".", true)

                result.extension = splitted.value
                result.name = splitted.key
            }

            var splitted = _.kvsplit$(url, ":/")
            if (splitted.pos >= 0) {
                result.drive += splitted.key + ":/"
                result.path = splitted.value
            } else {
                result.drive = "./"  //process.cwd()
            }
        }

        result.path = _.path.normalize(result.path)

        return result
    }

})