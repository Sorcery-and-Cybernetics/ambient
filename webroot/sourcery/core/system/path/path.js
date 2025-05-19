//*************************************************************************************************
// basicpath - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
var fs = require("fs")

_.ambient.module("path", function (_) {
    _.path = _.path || {}
    var copybuffersize = 64 * 1024

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
        if (_.path.isdir$(path)) {
            return _.make.folder(path)
        } else {
            return _.make.file(path)
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
.ontest("open", function(_) {
    var folder = _.path.open("a/b/c/")
    var file = _.path.open("a/b/c.d")

    this.test(folder.fullpath()).is("./a/b/c/", "folder fullpath")
    this.test(folder instanceof _.make.folder).is(true, "folder is instance of folder")
    this.test(folder.name()).is("c", "folder name")
    this.test(folder.path()).is("a/b/c/", "folder path")

    this.test(file.fullpath()).is("./a/b/c.d", "file fullpath")
    this.test(file instanceof _.make.file).is(true, "file is instance of file")
    this.test(file.name()).is("c", "file name")
    this.test(file.path()).is("a/b/", "file path")
    this.test(file.extension()).is("d", "file extension")
})