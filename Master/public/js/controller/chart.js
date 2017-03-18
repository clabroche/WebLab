$.getJSON('/chart/result', {param1: 'value1'}, function (json, textStatus) {
  let data = {}
  let iterations = []
  console.log(json.slaves)
  // create array for output
  $.each(json.slaves, function (index, slave) {
    $.each(json.algo, function (index, output) {
      data[output] = []
    })
    $.each(slave.result, function (index, result) {
      $.each(result, function (index, variable) {
        if (index == 'iterations') {
          iterations.push(result.iterations)
        } else {
          data[index].push(variable)
        }
      })
    })
    createChart(slave.id, data, iterations)
    iterations = []
    data = {}
  })
})

function createChart (slaveId, data, iterations) {
  console.log(slaveId)
  console.log(data)
  console.log($('.containerChart'))
  $('.containerChart').append('<h3>' + slaveId + '</h3><canvas id="chart-' + slaveId + '" width="400px" height="120px"></canvas><br><br>')
  let datasets = []
  $.each(data, function (index, el) {
    console.log(el)
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
  var ctx = document.getElementById('chart-' + slaveId).getContext('2d')
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
