/**
 * This script manages the entry socket.io events for Master then it send it to the client
 */
let slaves = require('../Models/Slaves')
let algo = require('../Models/Algo')

let socket = (io) => {
  io.on('connection', (socket) => {
    socket.on('algorithmPreview', (data) => {
      socket.broadcast.emit('displayPreview', data)
    })
    socket.on('clientSlaveInit', (slaveParameter) => {
      let init = {
        slaves: slaves.all(),
        state: algo.get()
      }
      socket.emit('slaveInit', init)
    })
    socket.on('slaveConnection', (slaveParameter) => {
      let slave = {
        ip: slaveParameter.ip,
        port: slaveParameter.port,
        id: socket.id,
        available: true
      }
      slaves.addSlave(slave)
      socket.broadcast.emit('slaveConnection', slave)
      socket.on('disconnect', () => {
        slaves.remove(slave)
        socket.broadcast.emit('slaveDisconnect', slave)
      })
    })
  })
}
module.exports = socket
