/**
 * This file represents the child of the process, it runs a VM to execute the algorithm
 */
const {NodeVM, VMScript} = require('vm2')
const perfy = require('perfy')
const util = require('util')
const VM = require('vm')
let eachr = require('util-each')

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
process.on('message', (m) => {
  if (m.algorithm != null && m.iteration != null) {
    let result = 'Undefined'
    let iterations = []
    let time = []
    let sandbox = {}
    eachr(m.input, function (inputValue, inputKey) {
      let input = inputValue.split('=')
      sandbox[input[0]] = input[1]
    })
    for (let i = 0; i < parseInt(m.iteration); i++) {
      try {
        perfy.start('rendering')

        const script = new VM.Script(m.algorithm)

        const context = new VM.createContext(sandbox)

        script.runInContext(context)
        iterations.push(result)
        let executionTime = perfy.end('rendering')
        time.push(executionTime.milliseconds)
        let sandboxResult = {}
        eachr(sandbox, function (sandboxValue, sandboxKey) {
          eachr(m.output, function (outputValue, outputKey) {
            if (sandboxKey == outputValue) {
              sandboxResult[outputValue] = sandboxValue
            }
          })
        })
        sandbox = sandboxResult
        sandboxResult.iterations = i
        process.send({
          result: sandboxResult
        })
      } catch (error) {
        process.send({
          error: error.toString(),
          nthIteration: i
        })
        return
      }
    }
  } else {
    process.send({ result: 'Error, did not get all the parameters' })
  }
})
