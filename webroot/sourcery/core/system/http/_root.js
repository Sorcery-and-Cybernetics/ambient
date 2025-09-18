_.ambient.rootmodule("http/")
    .require("sourcery/core/system/error/")
    .require("sourcery/core/system/path/")

    .include("httphelper", "server")
    .include("httpserver", "server")
    .include("httpresponse", "server")
    .include("httprequest", "server") 
    .include("testserver.http", "server && debugmode")
        
