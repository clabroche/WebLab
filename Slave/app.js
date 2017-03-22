let path = require('path')
let middlewaresAfter = require('./Middlewares/after')
let middlewaresBefore = require('./Middlewares/before')
let config = require('./config')
let ip = require('ip')
let findPort = require('find-port')

let index = require('./routes/index')
let users = require('./routes/users')

let express = require('express')

let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)
let ioClient = require('socket.io-client')

app.set('views', path.join(__dirname) + '/src/Slave/Views')
app.set('twig options', {
  strict_variables: false
})

app.set('view engine', 'twig')

middlewaresBefore(express, app, io)
app.use('/', index)
app.use('/users', users)

middlewaresAfter(express, app, io)
findPort('localhost', config.port.min, config.port.max, (ports) => {
  let port = ports[0]
  var prompt = require('prompt')
  // prompt.start()
  // prompt.get('adressMaster', function (err, result) {
  //   // On se connecte sur le master pour binder les evenements
  //   global.adressMaster = result.adressMaster
  //   let socket = ioClient.connect(global.adressMaster)
  //   // On notifie a master que l'esclave se connecte
  //   socket.emit('slaveConnection', {ip: ip.address(), port: port})
  //   server.listen(port)
  // })
  global.adressMaster = 'http://localhost:8081'
  let socket = ioClient.connect(global.adressMaster)
  // On notifie a master que l'esclave se connecte
  socket.emit('slaveConnection', {ip: ip.address(), port: port})
  server.listen(port)
})
