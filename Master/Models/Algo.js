const readline = require('readline')

let Algo = function () {
  let algo
  let output = []
  let input = []
  return {
    add (jsonAlgo) {
      // reinitialisation des données
      output = []
      input = []
      // parse du json et ajout des inputs outputs
      algo = JSON.parse(jsonAlgo)
      var lines = algo.split('\n')
      for (var i = 0; i < lines.length; i++) {
        var outputLine = lines[i].split('//#output:')
        var inputLine = lines[i].split('//#input:')
        if (outputLine[1]) {
          output.push(outputLine[1])
        }
        if (inputLine[1]) {
          input.push(inputLine[1])
        }
      }
    },
    getOutput () {
      return output
    },
    getInput () {
      return input
    },
    get () {
      return algo
    }
  }
}

module.exports = Algo()
