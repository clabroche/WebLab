/**
 * Function to add a Slave to the HTML Page
 */
function addSlave (slaveObject, state) {
  console.log(slaveObject)
  if (!$('.' + slaveObject.id).length) {
    let serverName = 'Server ' + slaveObject.ip + ':' + slaveObject.port
    let icon = $('<i>').addClass('ui disk outline icon')
    let title = $('<h3>').text(serverName).prepend(icon)
    let slave = $('<div>').addClass('slave ' + slaveObject.id)
    $.getJSON('http://' + slaveObject.ip + ':' + slaveObject.port + '/hardware', (config, textStatus) => {
      let totalRAM = (config.totalmem / Math.pow(10, 9)).toFixed(2)
      let currentRAM
      if (config.platform === 'linux') {
        currentRAM = (config.freemem / Math.pow(10, 8)).toFixed(2)
      } else {
        currentRAM = (config.freemem / Math.pow(10, 9)).toFixed(2)
      }
      let cpu = $('<div>').addClass('ui green active progress')
      cpu.append($('<div>').attr('style', 'transition-duration: 300ms; width:' + config.cpuUsage.toFixed(1) + '%;')
            .addClass('bar')
            .append($('<div>').addClass('progress').text(config.cpuUsage.toFixed(0) + '%')))
      let percent = Math.round((currentRAM * 100) / totalRAM)
      let ram = $('<div>').addClass('ui orange active progress')
           .append($('<div>').attr('style', 'transition-duration: 300ms; width:' + percent + '%;')
               .addClass('bar')
               .append($('<div>').addClass('progress').text(percent + '%'))
           ).append($('<div>').addClass('label').text('Memory : ' + currentRAM + 'GB /' + totalRAM + 'GB'))
      slave.append(cpu.clone().append($('<div>').addClass('label').text('CPU : ' + config.cpus[0].model + ' x' + config.cpus.length)))
      slave.append(ram)
      let card = createHTMLCard(serverName, slaveObject)
      $('#container1').append(card)
      toggleSlaves(state)
    })
    $('#slaveContainer').append(slave.append(title))
  }
}

function toggleSlaves (state) {
  if (!state) {
    $('.card').each(function (index, el) {
      $(this).append($('<div>').addClass('slave-disabled'))
    })
  } else {
    $('.card').each(function (index, el) {
      $(this).find('.slave-disabled').remove()
    })
  }
}
function createHTMLCard (serverName, slave) {
  let slaveId = slave.ip + ':' + slave.port
  slaveId = slaveId.split('.').join('')
  slaveId = slaveId.split(':').join('')
  let headerContent = '<i class="disk green outline icon"></i> ' + serverName
  let header = '<div class="header">' + headerContent + '</div>'
  let description = '<div class="description"> <form class="ui form"> ' +
    '<div class="field"> <input type="number" required class="iteration" placeholder="Number of iterations"> </div> ' +
    '<input type="hidden" name="slaveId" value="' + slaveId + '" </form> <br>' +
    '<div class="output" id="output-' + slaveId + '"> $ > </div> <br/>'
  let body = createStatus(slaveId, slave.status) + description
  let stopButton = $('<div>').addClass('ui basic red button stop-vm').prop('id', 'stop-' + slaveId).text('Stop').append($('<i>').addClass('window stop right icon'))
  let runButton = '<div class="ui basic blue button launch" id="' + slave.ip + ':' + slave.port + '"> Run<i class="caret right icon"></i> </div>'
  let buttons = $('<div>').addClass('extra content center aligned grid').prop('id', 'action-' + slaveId).append(runButton).append(stopButton)
  let content = header + body
  stopButton.hide()
  return $('<div>').addClass('card ' + slave.id).append($('<div>').addClass('content').append(content)).append(buttons)
}

function createStatus (slaveId, status) {
  console.log('createStatus')
  let $status
  switch (status) {
    case 'available':
      $status = '<div class="meta" id="meta-' + slaveId + '"> Available </div>'
      break
    case 'executing':
      $status = '<div class="meta" id="meta-' + slaveId + '"> Executing </div>'
      break
    case 'finish':
      console.log('finish')
      let link = $('<span>').text('Check the statistics')
      let info = $('<span>').addClass('ui tiny header green').text('Finished').add($('<i>').addClass('green check small icon'))
      $('#meta-' + slaveId).empty().append(info, link)
      link.click(function () {
        window.location = '/chart'
      })
      break
    default:

  }

  return $status
}
