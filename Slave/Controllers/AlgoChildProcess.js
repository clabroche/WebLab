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

process.on('message', (m) => {
  if (m.algorithm != null && m.iteration != null) {
    let result = 'Undefined'
    for (let i = 0; i < parseInt(m.iteration); i++) {
      try {
        result = virtualMachine.run(m.algorithm)
        process.send({ // To get previews
          preview: result,
          nthIteration: i
        })
      } catch (err) {
        console.error('Failed to execute script.', err)
        // ToDo: send error to client
      }
    }
    process.send({ result: result }) // To get the final result
  } else {
    process.send({ result: 'Error, did not get all the parameters' })
  }
})
