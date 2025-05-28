_.ambient.rootmodule("model/")
    .require("sourcery/core/oop/")
    .include("selfnode")
    .include("modelagent")
    .include("modelvalue")
    .include("model")

    .include("modelvalue/")

    .include("tests/", "debugmode")