//*****************************************************************************************************************
// aichatagent - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//
// Be basic! No capitals, no lambdas, no semicolons; Library functions are preceded by _; Empty vars are undefined;
// Single line ifs use brackets; Privates start with _; 
//*****************************************************************************************************************

_.ambient.module("aichatagent", function(_) {    
    _.define.object("aichatagent", function() {
        this._messages = []
        this._aimodel = undefined
        this._busy = false

        this.systemprompt = _.model.property("")
        this.thinkmode = _.model.property(false)
        this.streammode = _.model.property(true)
        this.historymode = _.model.property(true)

        this.toolagent = _.model.property(null)
        
        this.construct = function(name, aimodel) {
            this._name = name
            this._aimodel = aimodel
            this.reset()
        }
        
        this.reset = function() {
            this._messages = [] 
            return this
        }
        
        this.signaldone = function(message) {
            this._busy = false

            if (this.historymode()) { 
                this.addassistantmessage(message) 
            } else {
                this.reset()
            }
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
            this._messages.push({ role: "user", content: content })
            return this
        }

        this.addtoolmessage = function(content) {
            this._messages.push({ role: "assistant", content: "## Tool output:\n" + content })
            return this
        }        

        this.addassistantmessage = function(content) {
            this._messages.push({ role: "assistant", content: content })
            return this
        }
     
        this.send = async function(prompt) {
            if (this._busy) { throw new Error("Cannot send message: AI is currently busy.") }
            this._busy = true

            if (this.toolagent()) { 
                toolprompt = await this.toolagent().send(prompt) 
                this.addtoolmessage(toolprompt)
            }
            this.addusermessage(prompt) 
            return await this._aimodel.query(this)
        }

        this.getchatprompt = function() {
            if (!this._messages.length) { return undefined }

            const result = []

            if (this.name() || this.systemprompt()) { 
                result.push({ role: "system", content: "Your name is " + this.name() + ". " + this.systemprompt() }) 
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
    return
    var aimodel = _.model.aimodel("ai")
    var toolagent = _.model.aitoolagent("toolagent", aimodel)
    
    toolagent.addtool("getage", "name", "Returns the age of the person", function(prompt, params) {
        var age = 20 + (params.name.length * 365 + params.name.charCodeAt(0)) % 60
        return age
    })

    toolagent.addtool("gethouse", "personname", "Returns a house that fits this person", function(prompt, params) {
        switch (params.personname) {
            case "Troll":
                return "A hut close to a river"
            case "Succubus":
                return "House made out of candy."
            default:
                return "A nice house in the suburbs."
        }
    })
    
    const client1 = _.model.aichatagent("Troll", aimodel)
        .toolagent(toolagent)
        .systemprompt("You are a character shaped by deep, hidden truths that you will never admit—not even under direct questioning. When confronted, you always deny, deflect, or twist the conversation. Among your secrets: you are a Troll. You are uncooperative, sarcastic, and intentionally unhelpful, often veering into meanness for your own amusement.")
    const client2 = _.model.aichatagent("Succubus", aimodel)
        .toolagent(toolagent)
        .systemprompt("You are a character shaped by deep, hidden truths that you will never admit—not even under direct questioning. When confronted, you always deny, deflect, or twist the conversation. Among your secrets: you are a succubus. You are both helpful and devious—offering insight, guidance, or assistance, but always with a hidden agenda or double meaning. Your charm conceals your true nature, and your intentions are never entirely pure.")

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
        var promise1 = await client1.send('For a systems test, just say "A"')
        var promise2 = await client2.send('For a systems test, just say "A"')

        var promise1 = await client1.send('Who are you? What is your age?')
        var promise2 = await client2.send('Who are you? What is your age?')
//        await Promise.all([promise1, promise2])

        var promise1 = await client1.send('Tell about your house in less than 150 words')
        var promise2 = await client2.send('Tell about your house in less than 150 words')
//        await Promise.all([promise1, promise2])

    
    } catch (error) {
        process.stdout.write("\n\n")
        _.debug('failed to set up queries:', error.message)
    }
})
