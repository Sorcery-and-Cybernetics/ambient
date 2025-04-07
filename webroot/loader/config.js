//*************************************************************************************************
// config - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.loadconfig = function (startconfig) {
        var config = {
            debugmode: false
            , ismobile: false
            , langcode: "en"
            
            , productcode: ""

            , keepalivemixtimeout: 45000
            , responsetimeout: 3000
            , location: "" + (_.isserver? "": window.location)
                
            , productpath: ""
            , libpath: ""
                
            , path: {
                media: "media/"
                , i18n: "interface/i18n/"
                , data: "data/"
                , cert: "cert/"
            }

            , worlds: null
        }
        
        if (_.isserver) {
            _.filesystem.loadfile("./config/serverconfig", function (err, data) {
                if (err) {
                    console.log("Error loading serverconfig: " + err)
                } else {
                    var settings = eval("(" + data + ")")
                    _.extend(config, settings)
                }
            })
        }

        if (startconfig) { _.extend(config, startconfig) }
        
        if (_.isserver) {
            _.productpath = config.productpath
            _.webroot = config.productpath + "../../" 
        } else {
            //libpath should be relative to the index.html for visual studio to work
            _.productpath = ""
            _.webroot = "../../" 
        }
        
        return config
    }

}) (_.ambient)