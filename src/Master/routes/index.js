let express = require('express');
let homeController = require('../../../src/Master/Controllers/HomeController');
let hardwareController = require('../../../src/Master/Controllers/HardwareController');
let router = express.Router();

router.get('/', (req, res, next) => {
    new homeController(req, res, next).index();
});

router.get('/hardware', (req, res, next) => {
    new hardwareController(req, res, next).index();
});

router.get('/infos', (req, res, next) => {
    res.render('index', {
        title: 'Expreees'
    });
});

module.exports = router;
