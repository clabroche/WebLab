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
  let meta = '<span class="ui tiny header orange">Executing</span><i class="notched orange circle loading small icon"></i>'

  if ($('#meta-' + data.slaveId).html() !== meta) {
    $('#meta-' + data.slaveId).empty().append(meta)
    output.show()
  }
  output.append('[i=' + data.nthIteration + '] : ' + data.preview + ' <br>')
  output.animate({scrollTop: output.prop('scrollHeight')}, 12)
})

/**
 * Function to display the result of an algorithm
 */
socket.on('displayResult', (data) => {
  let meta = '<span class="ui tiny header green">Finished</span><i class="green check small icon"></i> - <a href=""> Check the statistics</a>'
  if ($('#meta-' + data.slaveId).val() !== meta) {
    $('#meta-' + data.slaveId).empty().append(meta)
  }
})

$('#uploadAlgo').click(() => {
  let algo = JSON.stringify(editor.getValue())
  $.post('/uploadAlgo', {algo: algo}, function (json, textStatus) {})
  toggleSlaves(true)
})

$('body').on('click', '.launch', function (event) {
  $('.output').text('$ >')
  $.post('/launchAlgo', {
    server: $(this).prop('id'),
    iteration: $(this).parents().find('.iteration').val(),
    slaveId: $(this).parents().find('form').find('input:hidden').val()
  })
})
