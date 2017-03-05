let Controller = require('./controller')
let slaves = require('../Models/Slaves')
let algo = require('../Models/Algo')
let rp = require('request-promise')
let AlgoController = class AlgoController {

  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }

  upload () {
    // eval(JSON.parse(this.req.body.algo))
    algo.add(this.req.body.algo)
  }

  launch () {
    let slave = slaves.get(this.req.body.server)
    if (slave !== undefined) {
      let options = {
        method: 'POST',
        body: {
          algo: JSON.stringify(algo.get()),
          iteration: this.req.body.iteration,
          slaveId: this.req.body.slaveId
        },
        uri: 'http://' + slave.ip + ':' + slave.port + '/launchAlgo',
        json: true // Automatically stringifies the body to JSON
      }
      rp(options).then(function (parsedBody) {
      }).catch(function (err) {
        if (err) {
        }
      })
    }
  }
}

module.exports = AlgoController
