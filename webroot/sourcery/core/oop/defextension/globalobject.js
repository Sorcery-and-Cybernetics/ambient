_.ambient.module("globalobject", function (_) {
    _.define.core.object("core.globalobject")
        .extend(function(definer) {
            return {
                make: function() {
                    _.helper.oop.addmodel(this.babyname, this.supermodelname, this.babydef)
                    _[this.babyname] = _.make[this.babyname](_)
                }
            }
        })
})