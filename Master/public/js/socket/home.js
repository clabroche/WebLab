let socket = io('http://localhost:8081')
// Recuperation des serveurs deja connecte
socket.on('slaveInit', (slaves) => {
  // Pour chaque esclave on met a jour la vue
  slaves.forEach(slave => {
    addSlave(slave.port, slave.ip)
  })
})

/**
 * When a slave connects to the application
 */
socket.on('slaveConnection', (slave) => {
  addSlave(slave.port, slave.ip)
})

/**
 * Function when a slave disconnect from the application
 */
socket.on('slaveDisconnect', (port) => {
  $('#' + port).remove()
})

/**
 * Function that makes the counter static (do not remove !)
 */
let countServerId = ( () => {
    let i = 0;
    return () => {
        i++;
        return i;
    };
})();

/**
 * Function to add a Slave to the HTML Page
 * @param port
 * @param ip
 */
function addSlave (port, ip) {
  if (!$('#' + port).length) {
    let icon = $('<i>').addClass('ui disk outline icon')
    let title = $('<h3>').text("Server #" + countServerId()).prepend(icon)
    let slave = $('<div>').addClass('slave').prop('id', port).click((event) => {
      $.getJSON('http://' + ip + ':' + port + '/hardware', (json, textStatus) => {
        $.each(json, (index, el) => {
          let hardwareRow = $('<div>').text(index + ':' + el)
          slave.append(hardwareRow)
        })
      })
    })
    $('#slaveContainer').append(slave.append(title))
  }
}
