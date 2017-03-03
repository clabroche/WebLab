/**
 * This file represents the child of the process, it runs a VM to execute the algorithm
 */
const {NodeVM} = require('vm2')
let vm = new NodeVM({
  wrapper: 'none',
  require: {
    external: true
  }
})

process.on('message', (m) => {
  console.log('CHILD got message:', m)
})
process.send({ foo: 'bar' })