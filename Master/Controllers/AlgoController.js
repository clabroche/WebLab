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
    console.log(this.req.body.server)
    // let slave = slaves.available()[0]
    // if (slave !== undefined) {
    //   var options = {
    //     method: 'POST',
    //     body: {
    //       algo: algo.get()
    //     },
    //     uri: 'http://' + this.req.body.ip + ':' + this.req.body.port + '/launchAlgo',
    //     json: true // Automatically stringifies the body to JSON
    //   }
    //   rp(options).then(function (parsedBody) {
    //   }).catch(function (err) {
    //     if (err) {
    //     }
    //   })
    // }
  }
}

module.exports = AlgoController
