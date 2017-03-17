const readline = require('readline')

let Algo = function () {
  let algo
  let output = []
  return {
    add (jsonAlgo) {
      algo = JSON.parse(jsonAlgo)
      var lines = algo.split('\n')
      output = []
      for (var i = 0; i < lines.length; i++) {
        var outputLine = lines[i].split('//#output:')
        if (outputLine[1]) {
          output.push(outputLine[1])
        }
      }
    },
    getOutput () {
      return output
    },
    get () {
      return algo
    }
  }
}

module.exports = Algo()
