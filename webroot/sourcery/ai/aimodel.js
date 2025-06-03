//*************************************************************************************************
// aimodel - Copyright (c) 2025 Sorcery and Cybernetics. All rights reserved.
//*************************************************************************************************
_.ambient.module("aimodel", function(_) {    
    _.define.object("aimodel", function (supermodel) {
        this._apiurl = "http://localhost:11434/api/chat"
        this._model = "llama3"
        this._currentrequest = undefined
        this._abortcontroller = undefined
        this._streammode = true
        this._history = undefined

        this.construct = function(apiurl, model, history) {
            if (apiurl) { this._apiurl = apiurl } 
            if (model) { this._model = model }
            this._history = (history? history: _.model.aihistory())
            this._currentrequest = null
            this._abortcontroller = null
        }

        this.query = async function(prompt) {
            if (this._currentrequest) { throw new Error('Another request is in progress. Cancel it first or wait.') }

            this._abortcontroller = new AbortController()
            this._history.addmessage("user", prompt)
           
            try {
                const requestbody = {
                    model: this._model
                    , stream: this._streammode
                    , messages: this._history.messages()
                }

                const response = await fetch(this._apiurl, {
                    method: 'POST'
                    , headers: { 'Content-Type': 'application/json' }
                    , body: JSON.stringify(requestbody)
                    , signal: this._abortcontroller.signal
                    , think: false
                })

                this._currentrequest = response

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                if (this._streammode) {
                    const results = []
                    const reader = response.body.getReader()
                    const decoder = new TextDecoder()

                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break

                        const chunk = decoder.decode(value, { stream: true })
                        const lines = chunk.split('\n').filter(line => line.trim())

                        for (const line of lines) {
                            try {
                                const data = JSON.parse(line)

                                if (data.message && data.message.content) {
                                    var content = data.message.content
                                    results.push(content)
                                    this.onchunk(content)
                                } else if (data.error) {
                                    throw new Error(`stream error: ${data.error}`)
                                }
                            } catch (error) {
                                throw new Error(`failed to parse stream chunk: ${error.message}`)
                            }
                        }
                    }

                    this._history.addmessage("assistant", results.join(''))
                    this._currentrequest = null
                    this.ondone(results.join(''))
                    return results.join('')

                } else {
                    const data = await response.json()
                    if (!data.response) { throw new Error('no response field in api output') }
                    
                    this._history.addmessage("assistant", data.response)
                    this._currentrequest = null
                    this.ondone(data.response)
                    return data.response
                }
                
            } catch (error) {
                this._currentrequest = null
                if (error.name === 'aborterror') {
                    this.oncancel(prompt)
                    return null
                }
                throw error
            }
        }
        
        this.cancel = function() {
            if (this._currentrequest && this._abortcontroller) {
                this._abortcontroller.abort()
                this._currentrequest = null
                this._abortcontroller = null
                this.oncancel('User cancelled request')
            }
        }

        this.model = function() {
            return this._model
        }

        this.isbusy = function() {
            return !!this._currentrequest
        }

        this.destroy = function() {
            this.cancel()
            supermodel.destroy.call(this)
        }

        this.onchunk = _.model.signal()
        this.ondone = _.model.signal()
        this.oncancel = _.model.signal()
    })
})
.onload (async function(_) {
    const client = _.model.aimodel(null, 'goekdenizguelmez/JOSIEFIED-Qwen3:8b-q6_k')
    
    client.onchunk(function(chunk) {
        process.stdout.write(chunk)
    })
    
    client.ondone(function(response) {
        _.debug('Query completed. Full response:', response)
    })
    
    try {
        await client.query('Who are you?')
        await client.query('write a detailed history of the universe.')
    } catch (error) {
        _.debug('failed to set up queries:', error.message)
    }
})
