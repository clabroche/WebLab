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
  if (data.iterations.length === 0) {
    return
  }
  let info = $('<span>').addClass('ui tiny header green').text('Finished').add($('<i>').addClass('green check small icon'))
  if (!isNaN(parseFloat(data.iterations[0])) && isFinite(data.iterations[0])) {
    let link = $('<span>').text('Check the statistics').click(() => {
      $('#dashboard').fadeOut(900, () => {
        $('#result').css('display', 'hidden')
        $('#result').fadeIn(900)
        let ctx = $('#output')
        let labels = []
        let values = []
        let nbIterations = data.iterations.length
        if (nbIterations < 4) {
          for (let i = 0; i < nbIterations; i++) {
            labels.push('i = ' + i)
            values.push(data.iterations[i])
          }
        } else {
          labels.push('i = 0')
          values.push(data.iterations[0])
          let arrayRandom = []
          for (let i = 1; i < 3; i++) {
            let random = (Math.random() * ((nbIterations - 1) - i) + 1).toFixed(0)
            if (arrayRandom.length > 0) {
              while (arrayRandom[arrayRandom.length - 1] >= random) {
                random = (Math.random() * ((nbIterations - 1) - i) + 1).toFixed(0)
              }
            }
            values.push(data.iterations[random])
            arrayRandom.push(random)
            labels.push('i = ' + random)
          }
          labels.push('i = ' + (nbIterations - 1))
          values.push(data.iterations[nbIterations - 1])
        }
        let sum = 0
        for (let i = 0; i < values.length; i++) {
          sum += values[i]
        }
        let average = sum / values.length
        let chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Output value - Average : ' + average,
              data: values,
              backgroundColor: 'rgba(153,255,51,0.4)'
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        })
      })
    })
    let meta = info.add(link)
    if ($('#meta-' + data.slaveId).val() !== meta) {
      $('#meta-' + data.slaveId).empty().append(meta)
    }
  } else {
    if ($('#meta-' + data.slaveId).val() !== info) {
      $('#meta-' + data.slaveId).empty().append(info)
    }
  }
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
  let slaveId = $(this).parents().find('form').find('input:hidden').val()
  $('#output-' + slaveId).text('$ >')
  $('#meta-' + slaveId).text('Available')
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
    server: $(this).prop('id'),
    iteration: $(this).parents().find('.iteration').val(),
    slaveId: slaveId
  })
})
