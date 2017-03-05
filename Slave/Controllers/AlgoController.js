/* module gerant la page d'acceuil */
let Controller = require('./controller')
let ioc = require('socket.io-client')
let AlgoController = class AlgoController {
  constructor (req, res, next) {
    this.req = req
    this.res = res
    this.next = next
    this.controller = new Controller(req, res, next)
    this.child = require('child_process').fork(`${__dirname}/AlgoChildProcess.js`)
  }
  launch () {
    this.child.send({  // We send data to the fork
      algorithm: JSON.parse(this.req.body.algo),
      iteration: this.req.body.iteration
    })
    this.child.on('message', (m) => { // Data the fork sent us after it ran the algorithm
      if (m.preview != null && m.nthIteration != null) {
        let client = ioc.connect('http://localhost:8081')
        client.once('connect', () => {
          client.emit('algorithmPreview')
        })
      }
     /** if (m.result != null) {
        console.log('\n ---- \n Result of the algorithm:', m.result)
      } */
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
