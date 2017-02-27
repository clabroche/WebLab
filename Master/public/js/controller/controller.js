let socket = io('http://localhost:8081')
// Recuperation des serveurs deja connecte
socket.on('slaveInit', (slaves) => {
  // Pour chaque esclave on met a jour la vue
  slaves.forEach(slave => {
    addSlave(slave)
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

$('#uploadAlgo').click(() => {
  let algo = JSON.stringify(editor.getValue())
  $.post('/uploadAlgo', {algo: algo}, function (json, textStatus) {})
})

$('body').on('click', '.launch', function (event) {
  let iteration = $(this).parents().find('.iteration').val()
  $.post('/launchAlgo', {server: $(this).prop('id'), iteration: iteration}).done((data) => {}).fail((data) => {})
})
