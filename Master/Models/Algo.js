let Algo = function () {
  let algo
  return {
    add (jsonAlgo) {
      algo = JSON.parse(jsonAlgo)
    },
    get () {
      return algo
    }
  }
}

module.exports = Algo()
