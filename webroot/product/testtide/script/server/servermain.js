//*************************************************************************************************
// servermain - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************

_.ambient.module("servermain").source(function (_) {
    _.define.core.object("servermain", function() {
        this._server = undefined;
        this._port = "localhost";
        this._host = 80;
        
        this.construct = function(host, port) {
            if (host) { this._host = host; }
            if (port) { this._port = port }
        }
        
        this.start = function() {
            var me = this;            
            this._server = _.make.webserver(this._host, this._port)

            this._server.onerror(function(err) {
                me.onerror(err);
            })
            this._server.start()

            return this
        }

        this.stop = function() {
            this.__server.stop();
            return this;
        }
        
        this.onerror = _.make.core.basicsignal();
    })
})
.onload(function(_) {
    _.server = _.make.servermain("localhost", 80)
        .onerror(function(err) {
            _.debug("Server error: " + err)
        })
        _.server.start()
    _.debug("Servermain is loaded")
})
