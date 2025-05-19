//*************************************************************************************************
// listcursor - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("listcursor", function (_) {
    
    _.define.object("listcursor", function (supermodel) {
        return {
            _list: null
            , _currentnode: null

            , construct: function(list) {
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
                this._currentnode = this._currentnode? this._currentnode.__nodenext: null
                return !this.eof() 
            }

            , moveprev: function() { 
                this._currentnode = this._currentnode? this._currentnode.__nodeprev: null
                return !this.eof()
            }

            , eof: function() { return !(this._current && (this._current != this._list)) }
        }
    })
})
