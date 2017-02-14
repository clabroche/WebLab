var socket = io('http://localhost:8081')
// Recuperation des serveurs deja connecte
socket.on('slaveInit', (slaves) => {
  // Pour chaque esclave on met a jour la vue
  slaves.forEach(slave => {
    addSlave(slave.port, slave.ip)
  })
})

// Lors d'une nouvelle connexion d'un esclave
socket.on('slaveConnection', (slave) => {
  // On ajoute l'esclave a la vue
  addSlave(slave.port, slave.ip)
})

// Lors de la deconnxion d'un esclave
socket.on('slaveDisconnect', (port) => {
  // On supprime l'esclave de la vue
  $('#' + port).remove()
})

// Template pour ajouter un esclave
function addSlave (port, ip) {
  if (!$('#' + port).length) {
    let title = $('<h1>').text(ip + ':' + port)
    let infos = $('<div>').addClass('infos')
    let interact = $('<div>').addClass('interact')
    interact.append('<button>').addClass('btn').text('hardware').click((event) => {
      $.getJSON('http://' + ip + ':' + port + '/hardware', (json, textStatus) => {
        $.each(json, (index, el) => {
          let hardwareRow = $('<div>').text(index + ':' + el)
          infos.append(hardwareRow)
        })
      })
    })
    let slave = $('<div>').addClass('slave').prop('id', port)
    $('#slaveContainer').append(slave.append(title, interact, infos))
  }
}
