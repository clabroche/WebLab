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
    console.log(this.req.body.slaveId)
    this.id = this.req.body.slaveId
    this.child.send({
      algorithm: JSON.parse(this.req.body.algo),
      iteration: this.req.body.iteration
    })
    this.child.on('message', (m) => {
      let client = socket.connect('http://localhost:8081')
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
        }
      })
    })
    let client = socket.connect('http://localhost:8081')
    client.on('stopVM', (slaveId) => {
      if (this.id === slaveId && this.child.killed === false) {
        client.emit('stopFork')
        this.child.disconnect()
        this.child.kill('SIGTERM')
      }
    })
  }
}

module.exports = AlgoController
