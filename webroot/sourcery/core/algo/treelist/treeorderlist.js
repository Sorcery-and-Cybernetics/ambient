//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("treeorderlist", function (_) {
    _.define.treebaselist("treeorderlist", function () {
        this._rootnode = null

        this.pushfirst = function (item) {
            var node = this.first()

            this.insertnodebefore(found, node);
            return this
        }

        this.push = function (item) {
            var node = this.last()

            this.insertnodeafter(found, node)
            return this
        }
    })
})