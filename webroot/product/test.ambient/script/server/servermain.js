//****************************************************************************************************************************
// Ambient - Copyright (c) 2025 Sorcery and Cybernetics (SAC). All rights reserved.
//
// Style: Be Basic!
// ES2017; No capitals, no lambdas, no semicolons and no underscores in names; No let and const; No 3rd party libraries;
// Empty vars are undefined; Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("servermain").source(function (_) {
    _.define.object("servermain", function() {
        this._server = undefined
        this._port = "localhost"
        this._host = 80;

        this._aimodel = undefined
        this._aiagent = undefined
        this._toolagent = undefined
        
        this.construct = function(host, port) {
            var me = this

            if (host) { this._host = host; }
            if (port) { this._port = port }

            _.console.oninput(function(line) {
                me.handleinput(line)                
            })
        }

        this.runai = function(modelname, chatname, prompt) {
            var me = this

            var ai = _.model.aimodel(modelname || "ai")
            this._aimodel = ai
            this._toolagent = _.model.aitoolagent("toolagent", this._aimodel)

            this._toolagent
                .addtool("promptfile", "filename, prompt", "Loads the content of a file and applies a prompt to it.", async function(prompt, params) {
                    if (!params.prompt) { return "Error: No prompt provided" } 
                    if (!params.filename) { return "Error: No filename provided" } 

                    var filepath = "./../../sourcery/" + params.filename
                    var file = _.model.file(filepath)

                    if (!file.exists()) { return "Error: File not found: " + filepath }
                    var content = file.readastext()
                    content = "``` javascript\n" + content + "\n```"
                    var prompt = prompt + "\n\n" + content

                    //todo: Dont create a new agent, use this agent instead, or find another way how to deal with streams
                    var aichatagent = _.model.aichatagent("toolagent", ai)
                        .ondata(function(data) { _.console.write(data) })
                        .ondone(function(response) { _.console.write("\n\n") })
                        .onstart(function() { _.console.write(this.name() + ": ") })

                    aichatagent.send(prompt)
                })  
                
                // .addtool("promptfiles", "folder, prompt", "Reads the content of all files in a folder and applies a prompt to it.", function(params) {
                // })                


            this._aiagent =  _.model.aichatagent(chatname || "ai", this._aimodel)
                .toolagent(this._toolagent)
                .ondata(function(data) { _.console.write(data) })
                .ondone(function(response) { _.console.write("\n\n") })
                .onstart(function() { _.console.write(this.name() + ": ") })            

            if (prompt) { this._aiagent.systemprompt(prompt) }
        }
        
        this.start = function() {
            var me = this          
            this._server = _.model.webserver(this._host, this._port)
            
            this._server.onerror(function(err) {
                me.onerror(err)
            })

            this.runai()

            this._server.start()

            return this
        }

        this.stop = function() {
            this.__server.stop()

            return this;
        }

        this.handleinput = function(line) {
            var agent = this._aiagent

            if (!agent) { return }
            agent.send(line)
        }
        
        this.onerror = _.model.basicsignal();
    })
})
.onload(function(_) {
    _.server = _.model.servermain("localhost", 80)
        .onerror(function(err) {
            _.debug("Server error: " + err)
        })
        _.server.start()
    _.debug("Servermain is loaded")
})