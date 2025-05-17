//*************************************************************************************************
// folder - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("folder", function (_) {
    _.define.core.object("folder", function (supermodel) {
        this._drive = null
        this._path = null
        this._name = null

        this.construct = function (drive, path, name) {
            this._drive = drive
            this._path = path + name? (name + "/") : ""
            this._name = name
        }

        this.drive = function () { return this._drive }
        this.path = function () { return this._path }
        this.name = function () { return this._name }

        this.fullpath = function () { return this._drive + this._path }

        this.isfolder = function () { return true }
        this.isfile = function () { return false }

        this.rename = function (newname) {
            this.name(newname)

            var foldername = this.fullname()
            var newfoldername = this.parent().path() + newname
            return _.path.move(foldername, newfoldername)
        }

        this.move = function (path) {
            var foldername = this.fullname()
            var newfoldername = path + folder.name()

            return _.path.move(foldername, newfoldername)            
        }

    })

})