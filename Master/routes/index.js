let express = require('express')
let HomeController = require('../Controllers/HomeController')
let AlgoController = require('../Controllers/AlgoController')
let router = express.Router()

router.get('/', (req, res, next) => {
  new HomeController(req, res, next).index()
})

router.post('/uploadAlgo', (req, res, next) => {
  new AlgoController(req, res, next).upload()
})

router.post('/launchAlgo', (req, res, next) => {
  new AlgoController(req, res, next).launch()
})

router.get('/infos', (req, res, next) => {
  res.render('index', {
    title: 'Expreees'
  })
})

module.exports = router
