let algo = require('../Models/Algo')

let Slaves = function () {
  let slaves = []
  return {
    addSlave (io) {
      io.on('connection', (socket) => {
        socket.on('clientSlaveInit', (slaveParameter) => {
          let init = {
            slaves: slaves,
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
          slaves.push(slave)
          // On notifie la vue qu'un esclave s'est connecté
          socket.broadcast.emit('slaveConnection', slave)
          // Lors de la deconnexion
          socket.on('disconnect', () => {
            // On parcours le tableau des esclaves pour le supprimer de la liste
            slaves.forEach((slave, index, object) => {
              if (slave.id === socket.id) {
                object.splice(index, 1)
                // On notifie la vue de la deconnexion
                socket.broadcast.emit('slaveDisconnect', slave)
              }
            })
          })
        })
      })
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
    }
  }
}

module.exports = Slaves()
