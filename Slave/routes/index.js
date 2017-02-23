let express = require('express')
let HardwareController = require('../Controllers/hardwareController')
let AlgoController = require('../Controllers/AlgoController')
let router = express.Router()

/* GET home page. */
router.get('/hardware', (req, res, next) => {
  new HardwareController(req, res, next).getinfos()
})

router.post('/launchAlgo', (req, res, next) => {
  new AlgoController(req, res, next).launch()
})

module.exports = router
