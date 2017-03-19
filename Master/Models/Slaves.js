let algo = require('../Models/Algo')

let Slaves = function () {
  let slaves = []
  return {
    addSlave (slaveParameter) {
      slaves.push(slaveParameter)
    },
    all () {
      return slaves
    },
    get (slaveId) {
      let slaveResult
      slaves.forEach(slave => {
        if (slave.id === slaveId) {
          slaveResult = slave
        }
      })
      return slaveResult
    },
    pushResult (data) {
      slaves.forEach(slave => {
        if (slave.id === data.slaveId) {
          if (slave.result === undefined) {
            slave.result = []
          }
          slave.result.push(data.result)
        }
      })
    },
    changeStatus (slaveId, status) {
      slaves.forEach(slave => {
        if (slave.id === slaveId) {
          slave.status = status
        }
      })
    },
    setIterations (slaveId, iterations) {
      console.log(slaveId + ' ' + iterations)
      slaves.forEach(slave => {
        if (slave.id === slaveId) {
          slave.iterations = iterations
        }
      })
    },
    available () {
      let availableSlaves = []
      slaves.forEach(slave => {
        if (slave.available === true) {
          availableSlaves.push(slave)
        }
      })
      return availableSlaves
    },
    remove (slaveParameter) {
      slaves.forEach((slave, index, object) => {
        if (slave.id === slaveParameter.id) {
          object.splice(index, 1)
        }
      })
    }
  }
}

module.exports = Slaves()
