//****************************************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// 
// Style: Be Basic!
// ES2017; No capitals; no lambdas; no semicolons. No underscores; No let and const; No 3rd party libraries; 1-based lists;
// Single line if use brackets; Privates start with _; Library functions are preceded by _.;
//****************************************************************************************************************************

_.ambient.module("aimodel", function(_) {    
    _.define.object("aimodel", function (supermodel) {
        this._apiurl = "http://localhost:11434/api/chat/"
        this._model = "llama3"
        this._currentchat = null
        this._abortcontroller = null

        // New: queue and processing state
        this._queue = []
        this._processing = false        

        this.construct = function(model, apiurl) {
            if (model) { this._model = model }
            if (apiurl) { this._apiurl = apiurl } 
        }

        this.query = async function(aichatagent) {
            if (!aichatagent || !(aichatagent instanceof _.model.aichatagent)) { throw "Error: No aichatagent provided" }
            
            return new Promise((resolve, reject) => {
                this._queue.push({ aichatagent, resolve, reject })
                this._processQueue()
            })
        }
        
        this._processQueue = async function() {
            if (this._processing || this._queue.length === 0) return

            this._processing = true
            const { aichatagent, resolve, reject } = this._queue.shift()

            try {
                const result = await this._query(aichatagent)
                resolve(result)
            } catch (err) {
                reject(err)
            } finally {
                this._processing = false
                this._processQueue() // process next in queue
            }
        }        

        this._query = async function(aichatagent) {
            var me = this

            this._currentchat = aichatagent
            this._abortcontroller = new AbortController()

            aichatagent.signalstart()

            try {
                const requestbody = {
                    model: this._model
                    , stream: aichatagent.streammode()
                    , messages: aichatagent.getchatprompt()
                }
                if (!aichatagent.thinkmode()) { 
                    requestbody.think = false
                 }

                const response = await fetch(this._apiurl, {
                    method: 'POST'
                    , headers: { 'Content-Type': 'application/json' }
                    , body: JSON.stringify(requestbody)
                    , signal: this._abortcontroller.signal
                })

                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }

                if (aichatagent.streammode()) {
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
                                    aichatagent.signaldata(content)
                                } else if (data.error) {
                                    throw new Error(`stream error: ${data.error}`)
                                }
                            } catch (error) {
                                throw new Error(`failed to parse stream chunk: ${error.message}`)
                            }
                        }
                    }

                    this._currentchat = null
                    aichatagent.signaldone(results.join(''))
                    return results.join('')

                } else {
                    const data = await response.json()
                    if (!data.message && !data.message.content) { throw new Error('no response field in api output') }
                    
                    this._currentchat = null
                    aichatagent.signaldone(data.message.content)
                    return data.message.content
                }
                
            } catch (error) {
                this._currentchat = null
                if (error.name === 'aborterror') {
                    aichatagent.signalerror(error)
                    return null
                }
                throw error
            }
        }
        
        this.cancel = function(aichatagent) {
            // Cancel the active request
            if (this._currentchat === aichatagent) {
                if (this._abortcontroller) this._abortcontroller.abort()
                this._currentchat = null
                this._abortcontroller = null
                return true
            }

            // Cancel a queued request
            const index = this._queue.findIndex(item => item.aichatagent === aichatagent)
            if (index !== -1) {
                const [removed] = this._queue.splice(index, 1)
                if (removed.reject) {
                    removed.reject(new Error("Request was cancelled before it started."))
                }
                return true
            }

            return false // not found
        }

        this.model = function() {
            return this._model
        }

        this.isbusy = function() {
            return !!this._currentchat
        }

        this.destroy = function() {
            if (this._currentchat) { this._currentchat.cancel() }

            this._currentchat = null
            this._abortcontroller = null
            this._queue = []
            this._processing = false                        
            
            supermodel.destroy.call(this)
        }
    })
})
