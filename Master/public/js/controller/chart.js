let configChart = []
$.getJSON('/chart/result', {param1: 'value1'}, function (json, textStatus) {
  let data = {}
  let iterations = []
  // create array for output
  $.each(json.slaves, function (index, slave) {
    $.each(json.algo, function (index, output) {
      data[output] = []
    })

    slave.result = slave.result.filter(function (n) { return n !== null })
    slave.result = slave.result.sort(sortByIterations)
    $.each(slave.result, function (index, result) {
      $.each(result, function (index, variable) {
        if (index == 'iterations') {
          iterations.push(result.iterations)
        } else {
          data[index].push(variable)
        }
      })
    })
    createChart(slave.id, data, iterations, slave.ip + ':' + slave.port)
    iterations = []
    data = {}
  })
})

$('body').on('change', 'select', function () {
  let self = this
  let slaveId = this.id.split('-')[1]
  $.each(configChart, function (index, el) {
    if (el.slaveId === slaveId) {
      $('#chart-' + slaveId).find('iframe').remove()
      $('#chart-' + slaveId).find('canvas').replaceWith($('<canvas>').css({
        width: '400px',
        height: '120px'
      }))
      var ctx = $('#chart-' + slaveId).find('canvas')[0].getContext('2d')
      var myChart = new Chart(ctx, {
        type: self.value,
        data: el.data
      })
    }
  })
})
function createChart (slaveId, data, iterations, name) {
  let $chart = $('<div>').addClass('chart').prop('id', 'chart-' + slaveId)
  let $title = $('<h3>').text(name)
  let $canvas = $('<canvas>').css({
    width: '400px',
    height: '120px'
  })
  let $chooseGraph = $('<select>').prop('id', 'choose-' + slaveId).addClass('ui fluid selection dropdown chooser')
                      .append(
                        $('<option>').prop('value', 'line').text('line'),
                        $('<option>').prop('value', 'bar').text('bar'),
                        $('<option>').prop('value', 'radar').text('radar'),
                        $('<option>').prop('value', 'pie').text('pie'),
                        $('<option>').prop('value', 'bubble').text('bubble')
                      )
  $('.containerChart').append($chart.append($title, $canvas, $chooseGraph))
  let datasets = []
  $.each(data, function (index, el) {
    datasets.push({
      label: index,
      data: el,
      backgroundColor: getRandomColor()
    })
  })

  let dataChart = {
    labels: iterations,
    datasets: datasets
  }
  configChart.push({
    slaveId: slaveId,
    data: dataChart
  })
  var ctx = $('#chart-' + slaveId).find('canvas')[0].getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'line',
    data: dataChart
  })
}
function getRandomColor () {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }

  var c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    c = color.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.4)'
  }
  throw new Error('Bad Hex')
}

function sortByIterations (key1, key2) {
  return key1.iterations > key2.iterations
}
