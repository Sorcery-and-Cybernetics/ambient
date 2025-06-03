//*************************************************************************************************
// aichat - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("aichat", function(_) {    
    _.define.object("aichat", function() {
        this._messages = []
        this.aimodelname = undefined
        this._aimodel = undefined

        this.think = _.model.property(false)
        
        this.construct = function(aimodelname) {
            this.aimodelname = aimodelname
            this.clearhistory()
        }
        
        this.clearhistory = function() {
            this._messages = [] 
            if (!this.think()) { this.addusermessage("/set nothink") }
            return this
        }          

        this.runmodel = function() {
            var me = this

            if (this._aimodel) { return this }
            if (!this.aimodelname) { throw new Error('No aimodelname specified') }

            this._aimodel = _.model.aimodel(null, this.aimodelname, this)
                .ondata(function(data) { 
                    me.ondata(data) })
                .ondone(function(message) {
                    me.addassistantmessage(message)
                    me.ondone(message)
                })
                .oncancel(function() { me.oncancel() })
                .onerror(function(error) { me.onerror(error) })

            
            return this
        }

        this.addsystemmessage = function(content) {
            this._messages.push({ role: "system", content })
            return this
        }

        this.addusermessage = function(content) {
            this._messages.push({ role: "user", content })
            return this
        }

        this.addassistantmessage = function(content) {
            this._messages.push({ role: "assistant", content })
            return this
        }
     
        this.send = async function(prompt) {
            this.runmodel()
            this.addusermessage(prompt)
            return await this._aimodel.query(prompt, this)
        }

        this.messages = function() {
            return _.length(this._messages)? this._messages: undefined
        }

        this.destroy = function() {
            if (this._aimodel) { this._aimodel = this._aimodel.destroy() }
            supermodel.destroy.call(this)
        }

        this.ondata = _.model.signal()
        this.ondone = _.model.signal()
        this.oncancel = _.model.signal()        
        this.onerror = _.model.signal()        
    })    
})
.onload (async function(_) {
    const client = _.model.aichat('jenifer')
    
    client.ondata(function(data) {
        process.stdout.write(data)
    })
    
    client.ondone(function(response) {
        _.debug('Query completed. Full response:', response)
    })
    
    try {
        await client.send('Who are you?')
        await client.send('write a detailed history of the universe.')
    } catch (error) {
        _.debug('failed to set up queries:', error.message)
    }
})
