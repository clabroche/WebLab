/**
 * This script manages the entries for socket.io events for Master then it send it to the client
 */
let slaves = require('../Models/Slaves')
let algo = require('../Models/Algo')

let socket = (io) => {
  io.on('connection', (socket) => {
    socket.on('algorithmPreview', (data) => {
      socket.broadcast.emit('displayPreview', data)
    })
    socket.on('algorithmError', (data) => {
      socket.broadcast.emit('displayError', data)
    })
    socket.on('algorithmResult', (data) => {
      slaves.pushResult(data)
      slaves.changeStatus(data.slaveId, 'executing')
      socket.broadcast.emit('displayResult', slaves.get(data.slaveId))
    })
    socket.on('algorithmFinish', (data) => {
      slaves.pushResult(data)
      slaves.changeStatus(data.slaveId, 'finish')
      socket.broadcast.emit('displayFinish', slaves.get(data.slaveId))
    })
    socket.on('clientStoppedVM', (slaveId) => {
      slaves.changeStatus(slaveId, 'stopped')
      socket.broadcast.emit('stopVM', slaveId)
    })
    socket.on('clientSlaveInit', () => {
      let init = {
        slaves: slaves.all(),
        state: algo.get()
      }
      socket.emit('slaveInit', init)
    })
    socket.on('slaveConnection', (slaveParameter) => {
      let idSlaves = slaveParameter.ip.split('.').join('') + slaveParameter.port
      let slave = {
        ip: slaveParameter.ip,
        port: slaveParameter.port,
        id: idSlaves,
        status: 'available'
      }
      slaves.addSlave(slave)
      let init = {
        slave: slave,
        state: algo.get()
      }
      socket.broadcast.emit('slaveConnection', init)
      socket.on('disconnect', () => {
        slaves.remove(slave)
        socket.broadcast.emit('slaveDisconnect', slave)
      })
    })
  })
}
module.exports = socket
