/* module gerant la page d'acceuil */
let Controller = require('./controller')
const os = require('os')

let hardwareController = class hardwareController {
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }
  getinfos () {
    var cpuStats = require('cpu-stats')

    // the first argument is how long to sample for in ms.
    // longer is more accurate but, you know, longer.
    // if omitted, defaults to one second.
    cpuStats(1000, (error, result) => {
      console.error(error)
      let infos = {
        'architecture': os.arch(),
        'cpus': os.cpus(),
        'homedir': os.homedir(),
        'hostname': os.hostname(),
        'freemem': os.freemem(),
        'networkInterfaces': os.networkInterfaces(),
        'platform': os.platform(),
        'release': os.release(),
        'tmpdir': os.tmpdir(),
        'totalmem': os.totalmem(),
        'uptime': os.uptime(),
        'cpuUsage': result
      }
      this.res.send(infos)
    })
  }
}

module.exports = hardwareController
