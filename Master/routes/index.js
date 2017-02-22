let express = require('express')
let HomeController = require('../Controllers/HomeController')
let slaves = require('../Models/Slaves')
let HardwareController = require('../Controllers/HardwareController')
let router = express.Router()

router.get('/', (req, res, next) => {
  slaves.addSlave(res)
  new HomeController(req, res, next).index()
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
