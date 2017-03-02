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
    get (server) {
      server = server.split(':')
      let slaveResult
      slaves.forEach(slave => {
        if (slave.ip === server[0] && slave.port === Number(server[1])) {
          slaveResult = slave
        }
      })
      return slaveResult
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
