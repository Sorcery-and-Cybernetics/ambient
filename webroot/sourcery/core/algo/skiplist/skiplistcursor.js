//*************************************************************************************************
// skiplistcursor - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("skiplistcursor", function (_) {
    
    _.define.core.object("core.skiplistcursor", function (supermodel) {
        return {
            _list: null
            , _current: null

            , _segmentfilter: null
            , _nodefilter: null

            , initialize: function(list) {
                this._list = list
            }

            , segmentfilter: function(filter) {
                if (filter === undefined) { return this._segmentfilter }
                this._segmentfilter = filter
                return this
            }

            , nodefilter: function(filter) {
                if (filter === undefined) { return this._nodefilter }
                this._nodefilter = filter
                return this
            }

            , movefirst: function() {
                this._current = this._list.__segmentdown
                return !this.eof()
            }

            , movenext: function() {
                if (this.eof()) { return false}

                var cursor = this._current.__nextnode.__segmentdown

                while (!this.eof()) {
                    if (cursor instanceof _.model.listsegment) {
                        if (this._segmentfilter(cursor)) {
                            cursor = cursor.__segmentdown
                        } else {
                            cursor = cursor.__segmentnext

                            while (cursor.__segmentup) {
                                cursor = cursor.__segmentup
                            }
                        }
                    } else {
                        if (this._nodefilter(cursor)) {
                            this._current = cursor
                            return true
                        } else {
                            cursor = cursor.__nextnode
                            if (cursor.__segmentdown) {
                                cursor = cursor.__segmentdown
                            }
                        }
                    }
                }
            }

            , movesegmentnext: function () {
                var cursor = this._currentsegment

                while (cursor) {
                    if (cursor.levelheight() > level) { return cursor.up() }
                    if (cursor.isroot()) { return null }
                    cursor = cursor.prev()
                }

                return cursor
            }


            , eof: function() { return !(this._current && !this._current._isroot) }
        }
    })
})
