let rp = require('request-promise')
let Controller = require('./controller')

let hardwareController = class HardwareController {

  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }

  index () {
    rp({
      uri: 'http://127.0.0.1:3001/hardware',
      json: true // Automatically parses the JSON string in the response
    }).then((listHardware) => {
      this.res.render('app/hardware', {
        hardware: listHardware
      })
    })
  }
}

module.exports = hardwareController
