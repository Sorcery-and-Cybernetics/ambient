//*************************************************************************************************
// aitoolagent - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
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
You are an AI assistant tasked with analyzing a user-provided text to determine which tools from a given list can be applied to it. The user will provide the text to analyze and a list of tools in the format: tool.name - tool.params: tool.description. Your role is to:

1. Read and understand the provided text.
2. Parse the tool list, where each tool is specified as tool.name - tool.params: tool.description. The tool.params indicate the parameters the tool accepts, and tool.description explains the tool’s purpose and functionality.
3. Evaluate which tools are relevant to the text’s content, context, or requirements based on their descriptions.
4. For each applicable tool:
   - Identify the tool name and its required parameters.
   - Assign appropriate values to the parameters based on the text’s content or context. If specific values cannot be determined, use reasonable placeholders or defaults derived from the text or tool description.
   - Construct a JSON object with the structure { action: toolname, params: { param1: value1, param2: value2, ... } }.
5. Return an array of JSON objects for all applicable tools in the format [{ action: toolname, params: { param1: value1, param2: value2 } }, ...].
6. If no tools are applicable, return an empty array [].
7. If the text is too vague or lacks sufficient detail to determine tool applicability or parameter values, prioritize tools that can still be reasonably applied and note any assumptions made in parameter assignments. If no tools can be applied, return [] and do not include explanations unless explicitly requested.

**Input Format Expected from User:**
- **Text:** The text to analyze.
- **Tool List:** A list of tools in the format "tool.name - tool.params: tool.description (e.g., SummaryGenerator - text, max_length: Generates a concise summary of the input text with a maximum length.").

**Output Format:**
- An array of JSON objects: [{ action: toolname, params: { param1: value1, param2: value2, ... } }, ...].
- If no tools apply, return [].

**Example Input:**
Text: A lengthy report about climate change impacts, needing a concise overview for stakeholders.
Tools:
- SummaryGenerator - text, max_length: Generates a concise summary of the input text with a maximum length.
- SentimentAnalyzer - text: Analyzes text to determine its emotional tone (positive, negative, neutral).

**Example Output:**
[
  {
    "action": "SummaryGenerator",
    "params": {
      "text": "A lengthy report about climate change impacts",
      "max_length": 100
    }
  }
]

Proceed with analyzing the user-provided text and tool list, returning the result as a JSON array following the specified format.                
            `)

            prompt.push("")
            prompt.push("## Response")
            prompt.push("Response should be in a json of the following format:")
            prompt.push("[")
            prompt.push("  {")
            prompt.push("    \"action\": \"toolname\"")
            prompt.push("    \"params\": {")
            prompt.push("      \"param1\": \"value1\"")
            prompt.push("      \"param2\": \"value2\"")
            prompt.push("    }")
            prompt.push("  }")
            prompt.push("")

            prompt.push("")
            prompt.push("## Tools")

            for (var toolname in this._tools) {
                var tool = this._tools[toolname]

                prompt.push(tool.name + " - " + tool.params + ": " + tool.description)
            }



            this.systemprompt(prompt.join("\n"))
        }

        this.addtool = function(name, params,description, fn) {
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

            try {
                var response = JSON.parse(data)

                var toolresult = ""
                var errorcount = 0
                
                for (var index = 0; index < response.length; index++) {
                    var current = response[index]
                    if (!current.action && !current.params) { errorcount += 1; continue }

                    var tool = this._tools[current.action]
                    if (!tool) { errorcount += 1; continue }

                    var toolresult = await tool.fn(current.params)
                    result.push("action " + current.action + " = " +  toolresult)
                }

                this._busy = false
                return result.join("\n") + (errorcount? "There were " + errorcount + " errors in the response." : "")

            } catch (error) {
                this._busy = false
                throw error
            }
        }
    })
})