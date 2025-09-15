_.ambient.module("widgethelper", function (_) {
    
    _.efb = {
        none: 0
        , highlight: 1
        , click: 2
        , normal: 3
        , state: 4
        , sac: 6
        , stateaction: 7
        , option: 8
        , oac: 10
        , optionaction: 11
        , stateoption: 12
        , soc: 14
        , stateoptionaction: 15
        , capturekeys: 16
        , change: 32
        , mousemove: 64
        , drop: 128
        , drag: 256
        , size: 512
        , scroll: 1024
        , wheel: 2048
        , other: 32768
    }

    _.define.helper("widgethelper", function() {
    })
})