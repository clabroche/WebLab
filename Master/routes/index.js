let express = require('express')
let HomeController = require('../Controllers/HomeController')
let slaves = require('../Models/Slaves')
let HardwareController = require('../Controllers/HardwareController')
let AlgoController = require('../Controllers/AlgoController')
let router = express.Router()

router.get('/', (req, res, next) => {
  slaves.addSlave(res)
  new HomeController(req, res, next).index()
})

router.post('/uploadAlgo', (req, res, next) => {
  new AlgoController(req, res, next).upload()
})

router.get('/hardware', (req, res, next) => {
  new HardwareController(req, res, next).index()
})

router.get('/infos', (req, res, next) => {
  res.render('index', {
    title: 'Expreees'
  })
})

module.exports = router
