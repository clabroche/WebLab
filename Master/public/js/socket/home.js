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

$('#uploadAlgo').click(() => {
  let algo = JSON.stringify($('#textAlgo').val())
  $.post('/uploadAlgo', {algo: algo}, function (json, textStatus) {
    console.log(json)
  })
})
/**
 * Function to add a Slave to the HTML Page
 * @param port
 * @param ip
 */
function addSlave (port, ip) {
  if (!$('#' + port).length) {
    let serverName = 'Server ' + ip + ':' + port
    let icon = $('<i>').addClass('ui disk outline icon')
    let title = $('<h3>').text(serverName).prepend(icon)
    let slave = $('<div>').addClass('slave').prop('id', port)
    // .click((event) => {
    $.getJSON('http://' + ip + ':' + port + '/hardware', (config, textStatus) => {
      console.log(config)
      let cutePercent = config.cpuUsage[0].toFixed(2) * 1.8  // because when it's too low we don't see the text and the cpu is always low lol
      let cpu = $('<div>').addClass('ui green active progress')
            .append($('<div>').attr('style', 'transition-duration: 300ms; width:' + cutePercent + '%;')
                .addClass('bar')
                .append($('<div>').addClass('progress').text(config.cpuUsage[0].toFixed(1) + '%'))
            )
      let totalRAM = (config.totalmem / 1000000000).toFixed(2)
      let currentRAM = (config.freemem / 1000000000).toFixed(2)
      let percent = Math.round((currentRAM * 100) / totalRAM)
      let ram = $('<div>').addClass('ui orange active progress')
           .append($('<div>').attr('style', 'transition-duration: 300ms; width:' + percent + '%;')
               .addClass('bar')
               .append($('<div>').addClass('progress').text(percent + '%'))
           ).append($('<div>').addClass('label').text('Memory : ' + currentRAM + 'GB /' + totalRAM + 'GB'))

      slave.append(cpu.clone().append($('<div>').addClass('label').text('CPU : ' + config.cpus[0].model + ' x' + config.cpus.length)))
      slave.append(ram)
      $('#container1').append(createHTMLCard(serverName, cpu.clone().append($('<div>').addClass('label').text('CPU : ' + config.cpus[0].model)), ram))
    })

    $('#slaveContainer').append(slave.append(title))
  }
}

function createHTMLCard (serverName, cpuBar, ramBar) {
  let headerContent = '<i class="disk green outline icon"></i> ' + serverName
  let header = '<div class="header">' + headerContent + '</div>'
  let description = '<div class="description"> ' + cpuBar[0].outerHTML + '<br/>' + ramBar[0].outerHTML + '</div>'
  let body = '<div class="meta"> Available </div>' + description

  let action1 = '<div class="ui basic green button"> Pause </div>'
  let action2 = '<div class="ui basic red button"> Stop </div>'
  let actions = action1 + action2
  let buttons = '<div class="extra content"> <div class="ui two buttons">' + actions + '</div> </div>'
  let content = header + body

  return $('<div>').addClass('card').append($('<div>').addClass('content').append(content)).append(buttons)
}
