/* module gerant la page d'acceuil */
let Controller = require('./controller')
let ioc = require('socket.io-client')
let AlgoController = class AlgoController {
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
    this.child = require('child_process').fork(`${__dirname}/AlgoChildProcess.js`)
  }
  launch () {
    this.child.send({  // We send data to the fork
      algorithm: JSON.parse(this.req.body.algo),
      iteration: this.req.body.iteration
    })
    // When the child gave us the preview, we send it to the client
    this.child.on('message', (m) => {
      if (m.preview != null && m.nthIteration != null) {
        let client = ioc.connect('http://localhost:8081')
        client.once('connect', () => {
          client.emit('algorithmPreview', {
            preview: m.preview,
            nthIteration: m.nthIteration
          })
        })
      }
     /** if (m.result != null) {
        console.log('\n ---- \n Result of the algorithm:', m.result)
      } */
    })
  }
}

module.exports = AlgoController
