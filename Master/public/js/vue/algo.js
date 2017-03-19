/**
 * Function to add a Slave to the HTML Page
 */
function addSlave (slaveObject, state) {
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
  let $header = $('<div>').addClass('header')
  let $icon = $('<i>').addClass('disk green outline icon')
  let $title = $('<span>').text(slave.ip + ':' + slave.port)
  let $description = $('  <form class="ui form">' +
                            '<div class="field">' +
                              '<input type="number" required class="iteration" placeholder="Number of iterations">' +
                            '</div> ' +
                            '<input type="hidden" name="slaveId" value="' + slaveId + '">' +
                          '</form>' +
                          '<div class="output" id="output-' + slaveId + '"> $ > </div> <br/>')
  let $progressContainer = $('<div>').addClass('progressContainer-' + slaveId)
  let $body = $('<div>').append(createStatus(slaveId, slave.status), $description)
  let stopButton = $('<div>').addClass('ui basic red button stop-vm').prop('id', 'stop-' + slaveId).text('Stop').append($('<i>').addClass('window stop right icon'))
  let runButton = '<div class="ui basic blue button launch" id="' + slaveId + '"> Run<i class="caret right icon"></i> </div>'
  let buttons = $('<div>').addClass('extra content center aligned grid').prop('id', 'action-' + slaveId).append(runButton).append(stopButton)
  stopButton.hide()
  $header.append($icon, $title)
  let $card = $('<div>').addClass('card ' + slave.id).append($('<div>').addClass('content').append($header, $body, $progressContainer)).append(buttons)
  return $card
}

function createStatus (slaveId, status, progression) {
  let $status
  switch (status) {
    case 'available':
      if ($('#meta-' + slaveId).length) {
        $('#meta-' + slaveId).empty().text('Availaaaable')
      } else {
        $status = $('<div>').addClass('meta').prop('id', 'meta-' + slaveId).text('Available')
      }
      break
    case 'executing':
      let $executing = $('<span class="ui tiny header orange">Executing</span><i class="notched orange circle loading small icon"></i>')
      let $progressContainer = $('.progressContainer-' + slaveId)
      console.log('ljkkljklj' + $('.progress.' + slaveId).length)
      if ($('.progress.' + slaveId).length) {
        let $progress = $('.ui.active.progress.' + slaveId)
        $progress.children('.bar').css({
          'width': progression,
          'transition-duration': '300ms'
        })
        $progress.find('.progress').text(progression)
      } else {
        let $analytics = $('<span  class="statistics">').text('Check the statistics')
        if ($('#meta-' + slaveId).length) { $('#meta-' + slaveId).empty().append($executing, $analytics) } else {
          $status = $('<div>').addClass('meta').prop('id', 'meta-' + slaveId).append($executing, $analytics)
        }
        let $progress = $('<div>').addClass('ui active progress ' + slaveId).attr('data-percent', progression)
        let $bar = $('<div>').addClass('bar')
        let $textProgress = $('<div>').addClass('progress').text('0%')
        let $label = $('<div>').addClass('label').text('Progression')

        $progressContainer.append($progress.append($bar.append($textProgress), $label))
      }
      break
    case 'finish':
      let $meta = $('<span>').addClass('ui tiny header green').text('Finished').add($('<i>').addClass('green check small icon'))
      let $analytics = $('<span  class="statistics">').text('Check the statistics')
      $('.progressContainer-' + slaveId).empty()
      if ($('#meta-' + slaveId).length) {
        $('#meta-' + slaveId).empty().append($meta, $analytics)
      } else {
        $status = $('<div>').addClass('meta').prop('id', 'meta-' + slaveId).append($meta, $analytics)
      }
      $('body').on('click', '.statistics', function () {
        window.location.assign('/chart')
      })
      break
    default:

  }

  return $status
}
