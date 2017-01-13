var express = require('express');
var homeController = require('../../../src/Master/Controllers/HomeController');
var hardwareController = require('../../../src/Master/Controllers/HardwareController');
var router = express.Router();


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
