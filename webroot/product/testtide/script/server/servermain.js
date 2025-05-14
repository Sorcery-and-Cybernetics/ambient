//*************************************************************************************************
// servermain - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************

_.ambient.module("servermain").source(function (_) {
    _.define.core.object("servermain", function() {
        this.__server = undefined;
        this.__port = "localhost";
        this.__host = 80;
        
        this.construct = function(host, port) {
            if (host) { this.__host = host; }
            if (port) { this.__port = port }
        }
        
        this.start = function() {
            var me = this;            
            var server = _.make.webserver(this.__host, this.__port)

            server.onerror(function(err) {
                me.onerror(err);
            })

            this.__server = server;

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
        .start()
    _.debug("Servermain is loaded")
})
