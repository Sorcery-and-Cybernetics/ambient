//*************************************************************************************************
// aiagent - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("aihistory", function(_) {    
    _.define.object("aihistory", function() {
        this._messages = []
        
        this.construct = function() {
            this.clearhistory()
        }
        
        this.addmessage = function(role, content) {
            // Check if content starts with a username pattern (username: message)
            const match = content.match(/^([^:]+):\s*(.+)$/);
            if (match) {
                // Use the username as the role instead of generic role
                this._messages.push({ role: match[1], content: match[2] });
            } else {
                this._messages.push({ role, content });
            }
            return this;
        }
        
        this.clearhistory = function() {
            this._messages = [] 
            this.addmessage("user", "/set nothink")
            return this
        }
        
        // this.formatprompt = function() {
        //     if (this._messages.length === 0) return ""
            
        //     let formattedprompt = ""
        //     for (const msg of this._messages) {
        //         formattedprompt += `${msg.role}: ${msg.content}\n`
        //     }
        //     return formattedprompt
        // }

        this.messages = function() {
            return _.length(this._messages)? this._messages: undefined
        }
    })    
})
