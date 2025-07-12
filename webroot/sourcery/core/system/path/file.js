//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("file", function (_) {
    _.define.object("file", function (supermodel) {
        this._drive = null
        this._path = null
        this._name = null
        this._extension = null

        this.construct = function (path) {
            var path = _.path.splitpath(path)
            if (path.isdir) { throw "Error: Path is not a file" }

            this._drive = path.drive
            this._path = path.path
            this._name = path.name
            this._extension = path.extension
        }

        this.exists = function () {
            return _.path.fileexists(this.fullpath())
        }

        this.ensure = function () {
            if (!this.exists()) {
                var path = this.drive() + this.path()
                _.path.makedir(path)
            }
            return this
        }

        this.drive = function () { return this._drive }
        this.path = function () { return this._path }
        this.name = function () { return this._name }
        this.extension = function () { return this._extension }

        this.fullpath = function () { return this._drive + this._path + this._name + "." + this._extension }

        this.isfolder = function () { return true }
        this.isfile = function () { return false }

        //rename file
        this.rename = function (newname) {            
            if (!newname || !_.isstring(newname)) { throw "Error: newname should be a string" }

            var filename = this.fullname()
            var newfilename = this.path() + newname + "." + this.extension()
            
            try {
                _.path.move(filename, newfilename)
            } catch (e) {
                throw new Error("Rename file " + filename + " to " + newfilename)
            }

            this._name = newname
            return this
        }

        //function to move file
        this.move = function (path) {
            if (path instanceof _.model.folder) { path = path.fullpath() }
            if (!path || !_.isstring(path)) { throw "Error: path should be a string" }
            if (!_.isdir$(path)) { throw "Error: Path is not a path" }
            
            var filename = this.fullpath()
            var newfilename = path + this.name() + "." + this.extension()
            
            try {
                _.path.move(filename, newfilename)
            } catch (e) {
                throw new Error("Move file " + filename + " to " + newfilename)
            }

            this.construct(newfilename)
            return this
        }

        //read file as text
        this.readastext = function () {
            var filename = this.fullpath()

            var result = _.path.loadfile(filename, "utf-8")
            return result
        }
        //read file as binary
        this.readasbinary = function () {
            var filename = this.fullpath()

            var result = _.path.loadfile(filename, "binary")
            return result
        }

        this.writeastext = function () {
            var filename = this.fullpath()

            var result = _.path.savefile(filename, "utf-8")
            return result
        }

        this.writeasbinary = function () {
            var filename = this.fullpath()

            var result = _.path.savefile(filename, "binary")
            return result
        }        
    })

})