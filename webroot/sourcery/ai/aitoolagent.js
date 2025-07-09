//****************************************************************************************************************************
// Ambient - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("aitoolagent", function(_) {    
    _.define.aichatagent("aitoolagent", function() {
        this.streammode = _.model.property(false)
        this.historymode = _.model.property(false)
        this._tools = {}

        this.construct = function(name, aimodel) {
            this._name = name
            this._aimodel = aimodel
        }

        this.updateprompt = function() {
            var prompt = []

      prompt.push(`
Given a text and a list of tools (format: tool.name - [tool.params]: tool.description), identify applicable tools and return an array ofJSON objects with their names and parameter values derived from the text. Return only valid javascript JSON.

## Expected output:
An array of JSON objects with the following format: [{ action: toolname, params: { param1: value1, param2: value2, ... } }, ...].
If no tools apply, return [].

## Available Tools
            `)

            for (var toolname in this._tools) {
                var tool = this._tools[toolname]

                prompt.push(tool.name + " - [" + tool.params + "]: " + tool.description)
            }


            var toolprompt = prompt.join("\n")
            _.console.log(toolprompt)
            this.systemprompt(toolprompt)
        }

        this.addtool = function(name, params, description, fn) {
            this._tools[name] = { name: name, params: params, description: description, fn: fn }
            this.updateprompt()
            return this
        }

        this.send = async function(prompt) {
            if (this._busy) { throw new Error("Cannot send message: AI is currently busy.") }
            this._busy = true

            this.addusermessage(prompt) 
            var data = await this._aimodel.query(this)

            var result = []

//            try {
                var response = JSON.parse(data)

                var toolresult = ""
                var errorcount = 0
                
                for (var index = 0; index < response.length; index++) {
                    var current = response[index]
                    if (!current.action && !current.params) { errorcount += 1; continue }

                    var tool = this._tools[current.action]
                    if (!tool) { errorcount += 1; continue }

                    var toolresult = await tool.fn(prompt, current.params)
                    result.push("action " + current.action + " = " + toolresult)
                }

                this._busy = false
                return result.join("\n") + (errorcount? "There were " + errorcount + " errors in the response." : "")

            // } catch (error) {
            //     this._busy = false
            //     throw error
            //}
        }
    })
})