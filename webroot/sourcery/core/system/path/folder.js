//*************************************************************************************************
// folder - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("folder", function (_) {
    _.define.object("folder", function (supermodel) {
        this._drive = null
        this._path = null
        this._name = null

        this.construct = function (path) {
            var path = _.path.splitpath(path)
            if (!path.isdir) { throw "Error: Path is not a folder" }

            this._drive = path.drive
            this._path = path.path
            this._name = path.name
        }

        this.exists = function () {
            return _.path.direxists(this.fullpath())
        }

        this.ensure = function () {
            if (!this.exists()) {
                _.path.makedir(this.fullpath())
            }
            return this
        }

        this.drive = function () { return this._drive }
        this.path = function () { return this._path + this._name + "/" }
        this.name = function () { return this._name }

        this.fullpath = function () { return this._drive + this.path() }

        this.isfolder = function () { return true }
        this.isfile = function () { return false }

        this.rename = function (newname) {
            if (!newname || !_.isstring(newname)) { throw "Error: newname should be a string" }

            var foldername = this.fullname()
            var newfoldername = this.parent().path() + newname

            try {
                _.path.move(foldername, newfoldername)
            } catch (e) {
                throw new Error("Rename folder " + foldername + " to " + newfoldername)
            }

            this._name = newname
            return this
        }

        this.move = function (path) {
            if (path instanceof _.make.folder) { path = path.fullpath() }
            if (!path || !_.isstring(path)) { throw "Error: path should be a string" }
            if (!_.isdir$(path)) { throw "Error: Path is not a path" }

            var foldername = this.fullname()
            var newfoldername = path + folder.name()
            
            try {
                _.path.move(foldername, newfoldername)
            } catch (e) {
                throw new Error("Move folder " + foldername + " to " + newfoldername)
            }

            this.construct(newfoldername)
            return this
        }
    })

})