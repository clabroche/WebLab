$.getJSON('/chart/result', {param1: 'value1'}, function (json, textStatus) {
  let data = {}
  let iterations = []
  // create array for output
  $.each(json.algo, function (index, output) {
    data[output] = []
  })
  $.each(json.slaves, function (index, slave) {
    $.each(slave.result, function (index, result) {
      $.each(result, function (index, variable) {
        if (index == 'iterations') {
          iterations.push(result.iterations)
        } else {
          data[index].push(variable)
          // console.log(index + ':' + variable)
        }
      })
    })
  })
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
    datasets: datasets,
  }
  var ctx = document.getElementById('output').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: dataChart
  })
})
console.log(getRandomColor());

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
