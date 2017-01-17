let express = require('express');
let homeController = require('../../../src/Master/Controllers/HomeController');
let hardwareController = require('../../../src/Master/Controllers/HardwareController');
let router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  new homeController(req, res, next).index();
});

router.get('/hardware', function(req, res, next) {
  new hardwareController(req, res, next).index();
});

router.get('/infos', function(req, res, next) {
  res.render('index', { title: 'Expreees' });
});

module.exports = router;
