let Slaves = function () {
  let slaves = []
  return {
    addSlave (res) {
      res.io.on('connection', (socket) => {
        socket.emit('slaveInit', slaves)
        // Lors de la connection d'un serveur
        socket.on('slaveConnection', (slave) => {
          // On enregistre l'esclave
          slaves.push({
            ip: slave.ip,
            port: slave.port,
            id: socket.id,
            available: true
          })
          console.log(slave)
          // On notifie la vue qu'un esclave s'est connecté
          socket.broadcast.emit('slaveConnection', slave)
          // Lors de la deconnexion
          socket.on('disconnect', () => {
            // On parcours le tableau des esclaves pour le supprimer de la liste
            slaves.forEach((slave, index, object) => {
              if (slave.id === socket.id) {
                object.splice(index, 1)
                // On notifie la vue de la deconnexion
                socket.broadcast.emit('slaveDisconnect', slave.port)
              }
            })
          })
        })
      })
    },
    getSlaves () {
      return slaves
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
