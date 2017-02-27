
/**
 * Function to add a Slave to the HTML Page
 * @param port
 * @param ip
 */
function addSlave (slaveObject) {
  if (!$('.' + slaveObject.id).length) {
    let serverName = 'Server ' + slaveObject.ip + ':' + slaveObject.port
    let icon = $('<i>').addClass('ui disk outline icon')
    let title = $('<h3>').text(serverName).prepend(icon)
    let slave = $('<div>').addClass('slave ' + slaveObject.id)
    // .click((event) => {
    $.getJSON('http://' + slaveObject.ip + ':' + slaveObject.port + '/hardware', (config, textStatus) => {
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
      let card = createHTMLCard(serverName, cpu.clone().append($('<div>').addClass('label').text('CPU : ' + config.cpus[0].model)), ram, slaveObject)
      $('#container1').append(card)
    })
    $('#slaveContainer').append(slave.append(title))
  }
}

function createHTMLCard (serverName, cpuBar, ramBar, slave) {
  let headerContent = '<i class="disk green outline icon"></i> ' + serverName
  let header = '<div class="header">' + headerContent + '</div>'
  let description = '<div class="description"> ' + cpuBar[0].outerHTML + '<br/>' + ramBar[0].outerHTML + '</div>'
  let body = '<div class="meta"> Available </div>' + description
  let iteration = $('<div>').addClass('ui input').append($('<input>').addClass('iteration').prop({type: 'number', placeholder: 'iteration'}))
  let action1 = '<div class="ui basic green button"> Pause </div>'
  let action2 = '<div class="ui basic red button"> Stop </div>'
  let action3 = '<div class="ui basic blue button launch" id="' + slave.ip + ':' + slave.port + '"> launch </div>'
  let actions = action1 + action2 + action3
  let buttons = '<div class="extra content"> <div class="ui one buttons">' + actions + '</div> </div>'
  let content = header + body
  return $('<div>').addClass('card ' + slave.id).append($('<div>').addClass('content').append(content)).append(iteration).append(buttons)
}
