/**
 * This file represents the child of the process, it runs a VM to execute the algorithm
 */
const {NodeVM} = require('vm2')
let virtualMachine = new NodeVM({
  wrapper: 'none',
  require: {
    external: true
  }
})
let socket = require('socket.io-client')
let stop = false
process.on('message', (m) => {
  if (m.algorithm != null && m.iteration != null) {
    let result = 'Undefined'
    while (!stop) {
      for (let i = 0; i < parseInt(m.iteration); i++) {
        let client = socket.connect('http://localhost:8081')
        client.on('stopVM', () => {
          stop = true
          return
        })
        try {
          result = virtualMachine.run(m.algorithm)
          process.send({ // To get previews
            preview: result,
            nthIteration: i
          })
        } catch (error) {
          stop = true
          process.send({
            error: error.toString(),
            nthIteration: i
          })
          return
        }
      }
      stop = true
      process.send({result: result}) // To get the final result
    }
  } else {
    process.send({ result: 'Error, did not get all the parameters' })
  }
})

