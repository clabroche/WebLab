let Controller = require('./controller')
var safeEval = require('safe-eval')

let homeController = class HomeController {

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

module.exports = homeController
