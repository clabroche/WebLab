/**
 * Controller that manage the execution of an algorithm
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
    this.controller = new Controller(req, res, next)
    this.child = require('child_process').fork(`${__dirname}/AlgoChildProcess.js`)
  }

  /**
   * Function that runs an algorithm (send the code to the fork created)
   */
  launch () {
    console.log(this.req.body.iteration)
    this.child.send({
      algorithm: JSON.parse(this.req.body.algo),
      iteration: this.req.body.iteration
    })
    console.log(this.req.body)
    this.child.on('message', (m) => {
      let client = socket.connect('http://localhost:8081')
      client.once('connect', () => {
        if (m.preview != null && m.nthIteration != null) {
          client.emit('algorithmPreview', {
            slaveId: this.req.body.slaveId,
            preview: m.preview,
            nthIteration: m.nthIteration
          })
        } else if (m.result != null) {
          client.emit('algorithmResult', {
            slaveId: this.req.body.slaveId,
            result: m.result
          })
        }
      })
    })
  }
}

module.exports = AlgoController
