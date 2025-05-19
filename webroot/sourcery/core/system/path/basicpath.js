//*************************************************************************************************
// basicpath - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("basicpath", function (_) {
    _.path = _.path || {}

    _.path.normalize = function (path) {
        var path = (_.trim$(path)).replace(/\\/g, "/")

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

    var nodejspath = function (path) {
        path = _.trim$(path)
        if (path.indexOf(":/") >= 0) { return path }

        return (path.substr(0, 1) == "/" ? "." + path : "./" + path)
    }

    _.path.isdir$ = function (path) {
        path = _.trim$(path)
        return (path.substr(path.length - 1) == "/")
    }

    _.path.todir = function (url) {
        url = nodejspath(url)
        return (_.right$(url, 1) != "/" ? url + "/" : url)
    }    

    _.path.getname = function (path) {
        return _.path.splitpath(path).name
    }

    _.path.getextension = function (path) {
        return _.path.splitpath(path).extension
    }

    _.path.getdrive = function (path) {
        return _.path.splitpath(path).drive
    }

    _.path.getpath = function (path) {
        var path = _.path.splitpath(path)
        return path.path + (path.isdir ? (path.name + "/") : "")
    }

    _.path.splitpath = function (path) {
        var result =  { }
        path = _.path.normalize(path)

        //get drive
        result.isdir = ((path == "") || (_.right$(path, 1) == "/")) 

        var splitted = _.leftsplit$(path, ":/")            

        if (splitted.pos >= 0) {
            result.drive += splitted.key + ":/"
            path = splitted.value
        } else {
            result.drive = "./"
        }

        if (result.isdir) { path = _.left$(path, -1) }

        //get name and extension
        var splitted = _.rightsplit$(path, "/")

        path = (splitted.key? splitted.key + "/": "") 
        var name = splitted.value || ""

        if (result.isdir) {
            result.name = name
            result.extension = ''
            
        } else {
            var splitted = _.leftsplit$(name, ".")

            result.name = splitted.key
            result.extension = splitted.value
        }

        result.path = path
        return result
    }
})
.ontest("normalizepath", function(_) {
    this.test(_.path.normalize("a/b/c/")).is("a/b/c/")
    this.test(_.path.normalize("a/b/c")).is("a/b/c")
    this.test(_.path.normalize("a/b/../c")).is("a/c")
})
.ontest("splitpath", function(_) {
    this.test(_.path.splitpath("a/b/c/")).is({ isdir: true, drive: "./", path: "a/b/", name: "c", extension: "" })
    this.test(_.path.splitpath("a/b/c")).is({ isdir: false, drive: "./", path: "a/b/", name: "c", extension: "" })  
    this.test(_.path.splitpath("a/b/c.d")).is({ isdir: false, drive: "./", path: "a/b/", name: "c", extension: "d" })
    this.test(_.path.splitpath("c.d")).is({ isdir: false, drive: "./", path: "", name: "c", extension: "d" }, "splitpath extension")
})
