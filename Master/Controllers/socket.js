let slaves = require('../Models/Slaves')
let algo = require('../Models/Algo')

/* classe generique pour les controlleurs */
let socket = (io) => {
  io.on('connection', (socket) => {
    socket.on('clientSlaveInit', (slaveParameter) => {
      let init = {
        slaves: slaves.all(),
        state: algo.get()
      }
      socket.emit('slaveInit', init)
    })
    // Lors de la connection d'un serveur
    socket.on('slaveConnection', (slaveParameter) => {
      let slave = {
        ip: slaveParameter.ip,
        port: slaveParameter.port,
        id: socket.id,
        available: true
      }
      slaves.addSlave(slave)
      // On notifie la vue qu'un esclave s'est connecté
      socket.broadcast.emit('slaveConnection', slave)
      // Lors de la deconnexion
      socket.on('disconnect', () => {
        // On parcours le tableau des esclaves pour le supprimer de la liste
        slaves.remove(slave)
        socket.broadcast.emit('slaveDisconnect', slave)
      })
    })
  })
}
module.exports = socket
