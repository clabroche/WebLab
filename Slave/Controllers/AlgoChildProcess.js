/**
 * This file represents the child of the process, it runs a VM to execute the algorithm
 */
const {NodeVM, VMScript} = require('vm2')
let virtualMachine = new NodeVM({
  wrapper: 'none',
  require: {
    timeout: 1000,
    external: true,
    mock: {
      fs: {
        readFileSync () { return 'Nice try dude!' }
      }
    }
  }
})
let socket = require('socket.io-client')
let stop = false
process.on('message', (m) => {
  if (m.algorithm != null && m.iteration != null) {
    let result = 'Undefined'
    let client = socket.connect('http://localhost:8081')
    for (let i = 0; i < parseInt(m.iteration); i++) {
      if (!stop) {
        try {
          result = virtualMachine.run(new VMScript(m.algorithm))
          client.on('stopVM', () => {
            stop = true
          })
          if (!stop) {
            process.send({ // To get previews
              preview: result,
              nthIteration: i
            })
          }
        } catch (error) {
          stop = true
          process.send({
            error: error.toString(),
            nthIteration: i
          })
          return
        }
      }
    }
    if (!stop) {
      process.send({result: result}) // To get the final result
    }
  } else {
    process.send({ result: 'Error, did not get all the parameters' })
  }
})

