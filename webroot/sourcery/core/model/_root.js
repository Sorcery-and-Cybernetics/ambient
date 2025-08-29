_.ambient.rootmodule("model/")
    .require("sourcery/core/async/")
    .require("sourcery/core/algo/")

    .include("model/")
    .include("modelvalue/")
    .include("tests/", "debugmode")