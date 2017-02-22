let Controller = require('./controller')

let AlgoController = class AlgoController {

  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }

  upload () {
    eval(JSON.parse(this.req.body.algo))
  }
}

module.exports = AlgoController
