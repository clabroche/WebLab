/* module gerant la page d'acceuil */
let Controller = require('./controller')
const os = require('os')
const cpuStat = require('cpu-stat')

let hardwareController = class hardwareController {
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
  }
  getinfos () {
    cpuStat.usagePercent((err, percent, seconds) => {
      console.log(os.freemem() + ' ' + os.totalmem())
      if (err) { return console.log(err) }
      let infos = {
        'architecture': os.arch(),
        'cpus': os.cpus(),
        'homedir': os.homedir(),
        'hostname': os.hostname(),
        'freemem': os.totalmem() - os.freemem(),
        'networkInterfaces': os.networkInterfaces(),
        'platform': os.platform(),
        'release': os.release(),
        'tmpdir': os.tmpdir(),
        'totalmem': os.totalmem(),
        'uptime': os.uptime(),
        'cpuUsage': percent
      }
      this.res.send(infos)
    })
  }
}

module.exports = hardwareController
