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
    console.log(algo.get())
  }

  launch () {
    let slave = slaves.available()[0]
    console.log(slave.port)
    if (slave !== undefined) {
      var options = {
        method: 'POST',
        body: {
          algo: this.req.body.algo
        },
        uri: 'http://' + slave.ip + ':' + slave.port + '/launchAlgo',
        json: true // Automatically stringifies the body to JSON
      }
      rp(options).then(function (parsedBody) {
        console.log(parsedBody)
      }).catch(function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
  }
}

module.exports = AlgoController
