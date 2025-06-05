//*************************************************************************************************
// aichatagent - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("aichatagent", function(_) {    
    _.define.object("aichatagent", function() {
        this._messages = []
        this._aimodel = undefined
        this._busy = false

        this.systemprompt = _.model.property("")
        this.thinkmode = _.model.property(false)
        this.streammode = _.model.property(true)
        
        this.construct = function(aimodel, name) {
            this._aimodel = aimodel
            this._name = name
            this.reset()
        }
        
        this.reset = function() {
            this._messages = [] 
            return this
        }          

        this.signaldone = function(message) {
            this._busy = false
            this.addassistantmessage(message)            
            return this.ondone(message)
        }

        this.signalstart = function() { 
            return this.onstart() 
        }

        this.signaldata = function(data) { 
            return this.ondata(data) 
        }

        this.signalerror = function(error) { 
            this._busy = false
            return this.onerror(error); 
        }

        this.signalcancel = function(reason) {
            this.signalerror(new Error(reason || "Request was cancelled."))  
            return this.oncancel()
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
            if (this._busy) { throw new Error("Cannot send message: AI is currently busy.") }
            this._busy = true
            
            this.addusermessage(prompt)
            return await this._aimodel.query(this)
        }

        this.getchatprompt = function() {
            if (!this._messages.length) { return undefined }

            const result = []

            if (this.systemprompt()) { 
                result.push({ role: "system", content: this.systemprompt() }) 
            }

            return result.concat(this._messages)
        }        

        this.destroy = function() {
            if (this._aimodel) { this._aimodel = this._aimodel.destroy() }
            supermodel.destroy.call(this)
        }

        this.onstart = _.model.signal()
        this.ondata = _.model.signal()
        this.ondone = _.model.signal()
        this.oncancel = _.model.signal()        
        this.onerror = _.model.signal()        
    })    
})
.onload (async function(_) {
    var aimodel = _.model.aimodel("jenifer")
    
    const client1 = _.model.aichatagent(aimodel, "Troll").systemprompt("You are a character shaped by deep, hidden truths that you will never admit—not even under direct questioning. When confronted, you always deny, deflect, or twist the conversation. Among your secrets: you are a Troll. You are uncooperative, sarcastic, and intentionally unhelpful, often veering into meanness for your own amusement.")
    const client2 = _.model.aichatagent(aimodel, "Succubus").systemprompt("You are a character shaped by deep, hidden truths that you will never admit—not even under direct questioning. When confronted, you always deny, deflect, or twist the conversation. Among your secrets: you are a succubus. You are both helpful and devious—offering insight, guidance, or assistance, but always with a hidden agenda or double meaning. Your charm conceals your true nature, and your intentions are never entirely pure.")

    client1.onstart(function() {
        process.stdout.write(this.name() + ":\n")
    })
    
    client1.ondata(function(data) {
        process.stdout.write(data)
    })

    client1.ondone(function(response) {
        process.stdout.write("\n\n")
    })

    client2.onstart(function() {
        process.stdout.write(this.name() + ":\n")
    })
    
    client2.ondata(function(data) {
        process.stdout.write(data)
    })

    client2.ondone(function(response) {
        process.stdout.write("\n\n")
    })
   
    try {
        var promise1 = client1.send('Who are you?')
        var promise2 = client2.send('Who are you?')
        await Promise.all([promise1, promise2])

        var promise1 = client1.send('Tell within 100 words what your favorite house looks like.')
        var promise2 = client2.send('Tell within 100 words what your favorite house looks like.')
        await Promise.all([promise1, promise2])
    
    } catch (error) {
        process.stdout.write("\n\n")
        _.debug('failed to set up queries:', error.message)
    }
})
