/**
 * Controller that manages the execution of an algorithm
 */
let Controller = require('./controller')
let socket = require('socket.io-client')
let AlgoController = class AlgoController {
  /**
   * Constructor
   * @param req Request
   * @param res Response
   * @param next Next for middlewares
   */
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.id = 'Undefined'
    this.controller = new Controller(req, res, next)
    this.child = require('child_process').fork(`${__dirname}/AlgoChildProcess.js`)
  }

  /**
   * Function that runs an algorithm (send the code to the fork created)
   */
  launch () {
    this.id = this.req.body.slaveId
    this.child.send({
      output: this.req.body.output,
      input: this.req.body.input,
      algorithm: JSON.parse(this.req.body.algo),
      iteration: this.req.body.iteration
    })
    this.child.on('message', (m) => {
      let client = socket.connect(global.adressMaster)
      client.once('connect', () => {
        if (m.preview != null && m.nthIteration != null) {
          client.emit('algorithmPreview', {
            slaveId: this.id,
            preview: m.preview,
            nthIteration: m.nthIteration
          })
        } else if (m.error != null) {
          client.emit('algorithmError', {
            slaveId: this.id,
            error: m.error,
            nthIteration: m.nthIteration
          })
        } else if (m.result != null) {
          client.emit('algorithmResult', {
            slaveId: this.id,
            result: m.result,
            iterations: m.iterations,
            time: m.time
          })
        } else if (m.end != null) {
          client.emit('algorithmFinish', {
            slaveId: this.id
          })
        }
      })
    })
    let client = socket.connect(global.adressMaster)
    client.on('stopVM', (slaveId) => {
      if (this.id === slaveId && this.child.killed === false) {
        client.emit('stopFork')
        this.child.disconnect()
        this.child.kill('SIGTERM')
      }
    })
    client.on('pauseVM', (slaveId) => {
      client.emit('pauseFork')
      this.child.kill('SIGSTOP')
    })
    client.on('resumeVM', (slaveId) => {
      client.emit('resumeFork')
      this.child.kill('SIGCONT')
    })
  }
}

module.exports = AlgoController
