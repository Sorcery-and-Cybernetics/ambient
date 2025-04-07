//*************************************************************************************************
// listcursor - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
_.ambient.module("listcursor", function (_) {
    
    _.define.core.object("listcursor", function (supermodel) {
        return {
            _list: null
            , _currentnode: null

            , initialize: function(list) {
                this._list = list
            }

            , movefirst: function() { 
                this._currentnode = this
                return !this.eof()
            }

            , movelast: function() { 
                this._currentnode = this
                return !this.eof()
             }

            , movenext: function() { 
                this._currentnode = this._currentnode? this._currentnode.__nextnode: null
                return !this.eof() 
            }

            , moveprev: function() { 
                this._currentnode = this._currentnode? this._currentnode.__prevnode: null
                return !this.eof()
            }

            , eof: function() { return !(this._current && (this._current != this._list)) }
        }
    })
})
