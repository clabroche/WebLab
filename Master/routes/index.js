let express = require('express')
let HomeController = require('../Controllers/HomeController')
let AlgoController = require('../Controllers/AlgoController')
let ChartController = require('../Controllers/ChartController')
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
router.get('/chart', (req, res, next) => {
  new ChartController(req, res, next).index()
})
router.get('/chart/result', (req, res, next) => {
  new ChartController(req, res, next).result()
})

router.get('/infos', (req, res, next) => {
  res.render('index', {
    title: 'Expreees'
  })
})

module.exports = router
