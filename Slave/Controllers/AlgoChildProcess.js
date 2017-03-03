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
  console.log('The child (fork) got :', m)
  if (m.algorithm != null) {
    let result = virtualMachine.run(m.algorithm)
    process.send({ result: result })
  } else {}
})
