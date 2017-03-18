let socket = io('http://localhost:8081')
// Recuperation des serveurs deja connecte
socket.on('slaveInit', (init) => {
  init.slaves.forEach(slave => {
    addSlave(slave, init.state)
  })
})
socket.emit('clientSlaveInit')

/**
 * When a slave connects to the application
 */
socket.on('slaveConnection', (slave) => {
  addSlave(slave)
})

/**
 * Function when a slave disconnect from the application
 */
socket.on('slaveDisconnect', (slave) => {
  $('.' + slave.id).remove()
})

/**
 * Function to display the preview of an algorithm
 */
socket.on('displayPreview', (data) => {
  let output = $('#output-' + data.slaveId)
  let currentMeta = $('#meta-' + data.slaveId)
  let executing = '<span class="ui tiny header orange">Executing</span><i class="notched orange circle loading small icon"></i>'
  let finished = $('<span>').addClass('ui tiny header green').text('Finished').add($('<i>').addClass('green check small icon'))
  let finished2 = finished.add(' - ').add($('<span>').text('Check the statistics'))
  let stopped = '<span class="ui tiny header red">Stopped</span><i class="red unlinkify small icon"></i>'
  if (currentMeta.html() !== executing && currentMeta.html() !== finished && currentMeta.html() !== finished2 && currentMeta.html() !== stopped) {
    currentMeta.empty().append(executing)
    output.show()
  }
  output.append('[i=' + data.nthIteration + '] : ' + data.preview + ' <br>')
  output.animate({scrollTop: output.prop('scrollHeight')}, 12)
})

/**
 * Function to display an error of an algorithm
 */
socket.on('displayError', (data) => {
  let output = $('#output-' + data.slaveId)
  let currentMeta = $('#meta-' + data.slaveId)
  let executing = '<span class="ui tiny header orange">Executing</span><i class="notched orange circle loading small icon"></i>'
  let finished = $('<span>').addClass('ui tiny header green').text('Finished').add($('<i>').addClass('green check small icon'))
  let finished2 = finished.add(' - ').add($('<span>').text('Check the statistics'))
  let stopped = '<span class="ui tiny header red">Stopped</span><i class="red unlinkify small icon"></i>'
  if (currentMeta.html() !== executing && currentMeta.html() !== finished && currentMeta.html() !== finished2 && currentMeta.html() !== stopped) {
    currentMeta.empty().append(stopped)
    output.show()
  }
  output.append('<span>[i=' + data.nthIteration + '] Error : ' + data.error + ' </span><br>')
  output.animate({scrollTop: output.prop('scrollHeight')}, 12)
})

/**
 * Function to display the result of an algorithm
 */
socket.on('displayResult', (data) => {
  if (data.result.length === 0) {
    return
  }
  // create finish status
  createStatus(data.id, data.status)
})

/**
 * Function to save the algorithm
 */
$('#uploadAlgo').click(() => {
  let algo = JSON.stringify(editor.getValue())
  $.post('/uploadAlgo', {algo: algo}, function (json, textStatus) {})
  toggleSlaves(true)
})

/**
 * Function to render an algorithm
 */
$('body').on('click', '.launch', function (event) {
  let slaveId = $(this).prop('id')
  $('#output-' + slaveId).text('$ >')
  $('#meta-' + slaveId).text('Available')
  let iteration = $(this).parents('.' + slaveId).find('.iteration').val()
  let stopButton = $('#stop-' + slaveId)
  $(this).fadeOut(400, () => {
    let that = $(this)
    stopButton.fadeIn(400).click(() => {
      $('#meta-' + slaveId).empty().append('<span class="ui tiny header red">Stopped</span><i class="red unlinkify small icon"></i>')
      socket.emit('clientStoppedVM', slaveId)
      that.fadeIn(400)
      stopButton.fadeOut(400)
    })
  })
  $.post('/launchAlgo', {
    server: slaveId,
    iteration: iteration,
    slaveId: slaveId
  })
})
