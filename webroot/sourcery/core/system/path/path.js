//*************************************************************************************************
// basicpath - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("path", function (_) {
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
        path.isdir = ((path == "") || (_.right$(path, 1) == "/")) 

        var splitted = _.leftsplit$(path, ":/")            

        if (splitted.pos >= 0) {
            result.drive += splitted.key + ":/"
            path = splitted.value
        } else {
            result.drive = "./"
        }

        if (path.isdir) { path = _.left$(path, -1) }

        //get name and extension
        var splitted = _.rightsplit$(path, "/")

        path = splitted.key || ""
        var name = splitted.value || ""

        if (result.isdir) {
            result.name = name
            
        } else {
            var splitted = _.rightsplit$(name, ".")

            result.name = splitted.key
            result.extension = splitted.value
        }

        result.path = path
        return result
    }

    _.path.open = function (path) {
        var path = _.path.splitpath(path)

        if (path.isdir) {
            return _.make.folder(path.drive, path.path, path.name)
        } else {
            return _.make.file(path.drive, path.path, path.name, path.extension)
        }
    }
})
.ontest("normalizepath", function(_) {
    this.test("").is("./")
    this.test(_.path.normalize("a/b/c/")).is("a/b/c/")
    this.test(_.path.normalize("a/b/c")).is("a/b/c")
    this.test(_.path.normalize("a/b/../c")).is("a/c")
})
.ontest("splitpath", function(_) {
    this.test(_.path.splitpath("a/b/c/")).is({ isdir: true, drive: "./", path: "a/b", name: "c" })
    this.test(_.path.splitpath("a/b/c")).is({ isdir: false, drive: "./", path: "a/b", name: "c" })  
    this.test(_.path.splitpath("a/b/c.d")).is({ isdir: false, drive: "./", path: "a/b", name: "c", extension: "d" })
})