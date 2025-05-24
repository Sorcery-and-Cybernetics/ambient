//*************************************************************************************************
// listcursor - Copyright (c) 2024 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("listcursor", function (_) {
    
    _.define.object("listcursor", function (supermodel) {
        return {
            _list: undefined
            , _currentnode: undefined

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
                this._currentnode = this._currentnode? this._currentnode._nodenext: undefined
                return !this.eof() 
            }

            , moveprev: function() { 
                this._currentnode = this._currentnode? this._currentnode._nodeprev: undefined
                return !this.eof()
            }

            , eof: function() { return !(this._current && (this._current != this._list)) }
        }
    })
})
