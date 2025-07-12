_.ambient.rootmodule("model/")
    .require("sourcery/core/async/")
    .require("sourcery/core/algo/")
    .include("selfnode")
    .include("modelagent")
    .include("modelvalue")
    .include("model")

    .include("modelvalue/")

    .include("tests/", "debugmode")