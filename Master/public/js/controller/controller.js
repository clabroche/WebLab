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
 * Function when a slave send a preview
 */
socket.on('displayPreview', (data) => {
  let output = $('.output')
  output.show()
  output.append('[i=' + data.nthIteration + '] : ' + data.preview + ' <br>')
  output.animate({scrollTop: output.prop('scrollHeight')}, 25)
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
    slaveId: $(this).parents().find('form').find('input:hidden').val(),
    iteration: $(this).parents().find('.iteration').val()
  })
})
