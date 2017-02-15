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
let countServerId = (() => {
  let i = 0
  return () => {
    i++
    return i
  }
})()

/**
 * Function to add a Slave to the HTML Page
 * @param port
 * @param ip
 */
function addSlave (port, ip) {
  if (!$('#' + port).length) {
    let icon = $('<i>').addClass('ui disk outline icon')
    let title = $('<h3>').text('Server #' + countServerId()).prepend(icon)
    let slave = $('<div>').addClass('slave').prop('id', port).click((event) => {
      $.getJSON('http://' + ip + ':' + port + '/hardware', (config, textStatus) => {
        console.log(config)
        let cutePercent = config.cpuUsage[0].toFixed(2) * 1.8  // because when it's too low we don't see the text and the cpu is always low lol
        let cpu = $('<div>').addClass('ui green active progress')
              .append($('<div>').attr('style', 'transition-duration: 300ms; width:' + cutePercent + '%;')
                  .addClass('bar')
                  .append($('<div>').addClass('progress').text(config.cpuUsage[0].toFixed(1) + '%'))
              ).append($('<div>').addClass('label').text('CPU : ' + config.cpus[0].model + ' x' + config.cpus.length))
        let totalRAM = (config.totalmem / 1000000000).toFixed(2)
        let currentRAM = (config.freemem / 1000000000).toFixed(2)
        let percent = Math.round((currentRAM * 100) / totalRAM)
        let ram = $('<div>').addClass('ui orange active progress')
              .append($('<div>').attr('style', 'transition-duration: 300ms; width:' + percent + '%;')
                  .addClass('bar')
                  .append($('<div>').addClass('progress').text(percent + '%'))
              ).append($('<div>').addClass('label').text('Memory : ' + currentRAM + 'GB /' + totalRAM + 'GB'))

        slave.append(cpu)
        slave.append(ram)
      })
    })
    $('#slaveContainer').append(slave.append(title))
  }
}
