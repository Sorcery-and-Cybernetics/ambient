//*************************************************************************************************
// basicpath - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
var fs = require("fs")

_.ambient.module("path", function (_) {
    _.path = _.path || {}
    var copybuffersize = 64 * 1024

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

    _.path.fileexists = function (src) {
        try {
            return fs.statSync(src).isFile();
        } catch (err) {
            return false;
        }
    }

    _.path.direxists = function (path) {
        try {
            return fs.lstatSync(path).isDirectory();
        } catch (e) {
            return false;
        }
    }

    _.path.getdir = function (path, filter, trimpath, recursive, excludefolders, excludefiles, includeother) {
        if (!_.path.isdir(path)) { throw new Error("Not a directory") }

        filter = filter || "*"
        var files = fs.readdirSync(nodejspath(path))

        var fileresult = []
        var dirresult = []
        var subfolders = recursive ? [] : null

        _.foreach(files, function (file) {
            var fullname = path + file
            var stats = fs.statSync(nodejspath(fullname))
            var isdir = stats.isDirectory()

            if (isdir) {
                file += "/"
                if (recursive) {
                    subfolders.push(file)
                }
            }

            if (_.match$(file, filter) && (isdir ? !excludefolders : (stats.isFile() ? !excludefiles : includeother))) {
                if (isdir) {
                    dirresult.push((trimpath ? "" : path) + file)
                } else {
                    fileresult.push((trimpath ? "" : path) + file)
                }
            }
        })

        _.array.sort(dirresult, function (path) { return _.lcase$(path) })
        _.array.sort(fileresult, function (path) { return _.lcase$(path) })

        var result = dirresult.concat(fileresult)

        if (recursive) {
            _.foreach(subfolders, function (subfolder) {
                var files = _.path.getdir(path + subfolder, filter, trimpath, recursive, excludefolders, excludefiles)
                _.foreach(files, function (name) {
                    result.push((trimpath ? subfolder : "") + name)
                })
            })
        }
        return result
    }

    _.path.loadfile = function (filename, encoding) {
        if (encoding == "binary") {
            encoding = undefined
        } else {
            encoding = encoding || "utf-8"
        }

        if (_.right$(filename, 1) == "/") {
            throw new Error("Loadfile " + filename)
        }

        return fs.readFileSync(nodejspath(filename), encoding)
    }

    _.path.savefile = function (filename, data, encoding) {
        //todo: add path creation when path doesn't exists
        encoding = encoding || "utf-8"

        if (_.right$(filename, 1) == "/") { throw new Error("Save file " + filename) }

        fs.writeFileSync(nodejspath(filename), data, encoding)
        return true
    }

    _.path.appendfile = function (filename, data, encoding) {
        //todo: add path creation when path doesn't exists
        encoding = encoding || "utf-8"
        try {
            if (_.right$(filename, 1) == "/") { throw new Error("Append file " + filename) }

            fs.appendFileSync(nodejspath(filename), data, encoding)
        } catch (e) {
            throw new Error("Append file " + filename)
        }
        return null
    }
    

    _.path.open = function (path) {
        var path = _.path.splitpath(path)

        if (_.path.isdir$(path)) {
            return _.make.folder(path.drive, path.path, path.name)
        } else {
            return _.make.file(path.drive, path.path, path.name, path.extension)
        }
    }

    _.path.makedir = function (path) {
        var dirs = _.path.normalize(path).split("/")
        var path = ""

        _.foreach(dirs, function (dir, index) {
            if (dir) {
                if (!path) {
                    path = nodejspath(dir + "/")
                } else {
                    path += dir + "/"
                }

                if ((!_.path.direxists(path)) && path) {
                    fs.mkdirSync(path)
                }
            }
        })
    }
        
    _.path.rename = function (src, dest) { 
        fs.renameSync(nodejspath(src), nodejspath(dest))
    }
    _.path.del = function (src) { 
        fs.unlinkSync(nodejspath(src))
     }
    _.path.stats = function (src) { 
        return fs.statSync(nodejspath(src))
     }        

    _.path.move = function (src, dest) {
        //Todo: copy over drives, just assume the src and dest are on the same drive
        _.path.del(dest)
        return _.path.rename(src, dest)
    }

    _.path.copy = function (src, dest, overwritemode, callback) {
        //Todo: Implement Overwrite mode: [never, always, if newer, if older]
        //Use fstat() 
        if (_.isfunction(callback)) {
            var cbCalled = false;

            var rd = fs.createReadStream(src);
            rd.on("error", function (err) {
                done(err);
            });
            var wr = fs.createWriteStream(dest);
            wr.on("error", function (err) {
                done(err);
            });
            wr.on("close", function (ex) {
                done();
            });
            rd.pipe(wr);

            function done(err) {
                if (!cbCalled) {
                    callback(err);
                    cbCalled = true;
                }
            }

        } else {
            if (fs.existsSync(dest) && !overwritemode) {
                callback(new Error("Exists"))
            }

            var buffer = new Buffer(copybuffersize)

            var fdsrc = fs.openSync(src, "r")
            //var stat = fs.fstatSync(dest)  //What happens with mode if the file doesn't exists?
            var fddest = fs.openSync(dest, "w")//, stat.mode)
            var readsize = 1
            var pos = 0

            while (readsize > 0) {
                readsize = fs.readSync(fdsrc, buffer, 0, copybuffersize, pos)
                fs.writeSync(fddest, buffer, 0, readsize)
                pos += readsize
            }

            fs.closeSync(fdsrc)
            fs.closeSync(fddest)
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
.ontest("open", function(_) {
    var folder = _.path.open("a/b/c/")
    var file = _.path.open("a/b/c.d")

    this.test(folder.fullpath()).is("a/b/c/", "folder fullpath")
    this.test(folder instanceof _.model.folder).is(true, "folder is instance of folder")
    this.test(folder.name()).is("c", "folder name")
    this.test(folder.path()).is("a/b/c/", "folder path")

    this.test(file.fullpath()).is("a/b/c.d", "file fullpath")
    this.test(file instanceof _.model.file).is(true, "file is instance of file")
    this.test(file.name()).is("c", "file name")
    this.test(file.path()).is("a/b/", "file path")
    this.test(file.extension()).is("d", "file extension")
})