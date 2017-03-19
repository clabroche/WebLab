let Controller = require('./controller')
let slaves = require('../Models/Slaves')
let algo = require('../Models/Algo')

let chartController = class ChartController {

  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }

  index () {
    this.res.render('app/chart', {slaves: slaves.all()})
  }

  result () {
    console.log(slaves.all())
    this.res.send(JSON.stringify({slaves: slaves.all(), algo: algo.getOutput()}))
  }
}

module.exports = chartController
