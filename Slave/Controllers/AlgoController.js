/* module gerant la page d'acceuil */
let Controller = require('./controller')

let AlgoController = class AlgoController {
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }
  launch () {
    for (let i = 0; i < this.req.body.iteration; i++) {
      eval(JSON.parse(this.req.body.algo))
    }
  }
}

module.exports = AlgoController