/* module gerant la page d'acceuil */
let Controller = require('./controller')

let AlgoController = class AlgoController {
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
    this.child = require('child_process').fork(`${__dirname}/AlgoChildProcess.js`)
  }
  launch () {
    this.child.send({ algorithm: JSON.parse(this.req.body.algo) })
    this.child.on('message', (m) => {
      console.log('Controller (parent) got :', m)
      if (m.result != null) {
        console.log('Result of the algorithm:', m.result)
      }
    })

    /**  let tmp = require('tmp')
    let fs = require('fs')
    let currentFile = require.main.filename.slice(0, -3)
    let tmpFile = tmp.fileSync({ mode: '0644', prefix: 'algo-', postfix: '.js' })
    fs.appendFile(tmpFile.name, new Buffer('let dependency = require("' + currentFile + '") \n' +
      'const vm = dependency.nodeVM \n' +
      'console.log(vm.run("return 150"'   + JSON.parse(this.req.body.algo)+  + '))'))

   this.child.exec('node ' + tmpFile.name, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(stdout)
    })

   /** for (let i = 0; i < this.req.body.iteration; i++) {
      console.log('Console of the algorithm : ' + )
      let result = this.vm.run(JSON.parse(this.req.body.algo))
      console.log(result)
    } */
  }
}

module.exports = AlgoController
