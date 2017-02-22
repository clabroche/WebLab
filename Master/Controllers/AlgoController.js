let Controller = require('./controller')
let slaves = require('../Models/Slaves')
let AlgoController = class AlgoController {

  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }

  upload () {
    // eval(JSON.parse(this.req.body.algo))
    console.log(slaves.available())
  }
}

module.exports = AlgoController
