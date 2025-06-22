//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("httphelper").source(function (_) {
    _.define.helper("http", function() {

        var mimetypes = {
            "default": { maxage: 0, contenttype: "text/plain", encoding: "utf-8" }
            , "htm": { maxage: 0, contenttype: "text/html", encoding: "utf-8" }
            , "html": { maxage: 0, contenttype: "text/html", encoding: "utf-8" }
            , "css": { maxage: 0, contenttype: "text/css", encoding: "utf-8" }
            , "txt": { maxage: 0, contenttype: "text/plain", encoding: "utf-8" }
            , "csv": { maxage: 0, contenttype: "text/csv", encoding: "utf-8" }
            , "tsv": { maxage: 0, contenttype: "text/tab-separated-values", encoding: "utf-8" }
            , "rtf": { maxage: 3600, contenttype: "text/richtext", encoding: "utf-8" }
            , "pdf": { maxage: 3600, contenttype: "application/pdf" }
            , "zip": { maxage: 3600, contenttype: "application/zip", byteranged: true }
            , "doc": { maxage: 3600, contenttype: "application/msword" }
            , "docx": { maxage: 3600, contenttype: "application/msword" }
            , "xls": { maxage: 3600, contenttype: "application/vnd.ms-excel" }
            , "xlsx": { maxage: 3600, contenttype: "application/vnd.ms-excel" }
            , "ppt": { maxage: 3600, contenttype: "application/mspowerpoint" }
            , "pptx": { maxage: 3600, contenttype: "application/mspowerpoint" }
            , "js": { maxage: 0, contenttype: "application/javascript", encoding: "utf-8" }
            , "json": { maxage: 0, contenttype: "application/json", encoding: "utf-8" }
            , "xml": { maxage: 0, contenttype: "application/xml", encoding: "utf-8" }
            , "bmp": { maxage: 3600, contenttype: "image/bmp"}
            , "jpg": { maxage: 3600, contenttype: "image/jpg" }
            , "jpeg": { maxage: 3600, contenttype: "image/jpg" }
            , "gif": { maxage: 3600, contenttype: "image/gif" }
            , "png": { maxage: 3600, contenttype: "image/png" }
            , "webp": { maxage: 3600, contenttype: "image/webp" }
            , "avif": { maxage: 3600, contenttype: "image/avif" }
            , "ico": { maxage: 3600, contenttype: "image/x-icon" }
            , "svg": { maxage: 3600, contenttype: "image/svg+xml" }
            , "wav": { maxage: 3600, contenttype: "audio/wav", byteranged: true }
            , "mp3": { maxage: 3600, contenttype: "audio/mpeg", byteranged: true }
            , "mpg": { maxage: 3600, contenttype: "video/mpeg", byteranged: true }
            , "avi": { maxage: 3600, contenttype: "video/avi", byteranged: true }
            , "mp4": { maxage: 3600, contenttype: "video/mp4", byteranged: true }
            , "mov": { maxage: 3600, contenttype: "video/quicktime", byteranged: true }
            , "m4v": { maxage: 3600, contenttype: "video/m4v", byteranged: true }
            , "wmv": { maxage: 3600, contenttype: "video/wmv", byteranged: true }
            , "mkv": { maxage: 3600, contenttype: "video/x-matroska", byteranged: true } 
            , "webm": { maxage: 3600, contenttype: "video/webm", byteranged: true}
            , "eot": { maxage: 3600, contenttype: "application/vnd.ms-fontobject"}
            , "woff": { maxage: 3600, contenttype: "application/font-woff" }
            , "woff2": { maxage: 3600, contenttype: "application/font-woff2" }
            , "ttf": { maxage: 3600, contenttype: "application/x-font-truetype" }
            , "otf": { maxage: 3600, contenttype: "application/x-font-opentype" }
            , "bin": { maxage: 3600, contenttype: "application/octet-stream"}
            , "form": { maxage: 3600, contenttype: "application/x-www-form-urlencoded", encoding: "utf-8" }
        }

        //improve mimetype list and create contenttypes list
        var contenttypes = {}

        _.foreach(mimetypes, function (mimetype, name) {
            var contenttype = mimetype.contenttype

            if (!contenttype) { throw new Error("mimetype " + name + " has no contenttype") }

            if (!mimetype.encoding) {
                mimetype.encoding = "binary"
            }

            mimetype.extension = name
            mimetype.name = _.leftof$(contenttype, "/")
            mimetype.type = _.rightof$(contenttype, "/")
            
            if (name != "default") {
                contenttypes[contenttype] = mimetype
            } else {
                mimetype.extension = "txt"
            }
        })


        this.mimetypes = mimetypes;
        this.contenttypes = contenttypes;

        this.getmimetype = function (value) {
            value = _.lcase$(value);

            return this.mimetypes[value] || this.contenttypes[value] || this.mimetypes["default"];
        };
    });
})