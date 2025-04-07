//*************************************************************************************************
// httptest - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("httptest")
.onload(function (_) {

    var server = _.make.httpserver("bla", 80)
    server.onerror(function(err) {
        _.debug(err)
    })
    .onrequest(function(response) {
        response.write("hello world")
        response.end()
    })

    server.start()

    _.http.get("http://localhost:80")
    .onerror(function(err) {
        _.debug(err)
    })
    .onresponse(function(response) {
        _.debug(response)
        server.stop()
    })
})
