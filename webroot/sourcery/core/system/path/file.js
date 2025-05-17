//*************************************************************************************************
// file - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("file", function (_) {
    _.define.core.object("file", function (supermodel) {
        this._drive = null
        this._path = null
        this._name = null
        this._extension = null

        this.construct = function (drive, path, name, extension) {
            this._drive = drive
            this._path = path
            this._name = name
            this._extension = extension
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
            this._name = newname

            var filename = this.fullname()
            _.path.move(this.fullname(), this.path() + newname)
            return this
        }

        //function to move file
        this.move = function (path) {
            if (path instanceof _.model.folder) { path = path.fullpath() }
            if (!_.isstring(path)) { throw "Error: path should be a string" }
            if (!_.isdir(path)) { throw "Error: Path is not a path" }
            
            this._path = path
            _.path.move(this.fullname(), path + this.name())
            return this
        }

        //read file as text
        this.readastext = function () {
            var filename = this.fullname()

            var result = _.path.readastext(filename)
            return result
        }
        //read file as binary
        this.readasbinary = function () {
            var filename = this.fullname()

            var result = _.path.readasbinary(filename)
            return result
        }

        this.writeastext = function () {
            var filename = this.fullname()

            var result = _.path.writeastext(filename)
            return result
        }

        this.writeasbinary = function () {
            var filename = this.fullname()

            var result = _.path.readastext(filename)
            return result
        }        
    })

})