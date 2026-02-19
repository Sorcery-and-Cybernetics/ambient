global._ = global._ || {}
_ = global._


var normalizepath = function (path) {
    return (path || "").replace(/\\/g, "/")
}

var productpath = normalizepath(process.cwd()) + "/"

var config = {
    isserver: true
    
    , productpath: productpath
    , libpath: productpath + "../../sourcery/"
    , loaderpath: productpath + "../../"
}

require(config.loaderpath + "loader/_root.js")
  _.ambient
      .start(config)

//_.loader
//    .make()
//    .start(config)
//    .onload(function () {
//        _.servermain()
//    })


