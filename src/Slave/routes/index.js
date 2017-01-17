let express = require('express');
let hardwareController = require('../../../src/Slave/Controllers/hardwareController');
let router = express.Router();


/* GET home page. */
router.get('/hardware', function(req, res, next) {
  new hardwareController(req, res, next).getinfos();
});

router.get('/infos', function(req, res, next) {
  res.render('index', { title: 'Expreees' });
});

module.exports = router;
