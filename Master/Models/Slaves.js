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
      console.log('push')
      slaves.forEach(slave => {
        if (slave.id === data.slaveId) {
          console.log(slaves)
          if (slave.result === undefined) {
            slave.result = []
          }
          slave.result.push(data.result)
          console.log('==================')
          console.log(slaves)
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
