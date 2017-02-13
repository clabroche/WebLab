let express = require('express');
let homeController = require('../../../src/Master/Controllers/HomeController');
let hardwareController = require('../../../src/Master/Controllers/HardwareController');
let router = express.Router();

router.get('/', (req, res, next) => {


  var slaves = [];
  // Lorsque un connection quelconque apparait
  res.io.on('connection', function(socket) {
      socket.emit('slaveInit', slaves);
      //Lors de la connection d'un serveur
      socket.on('slaveConnection', function(slave) {
          // On enregistre l'esclave
          slaves.push({
              ip: slave.ip,
              port: slave.port,
              id: socket.id
          });
          // On notifie la vue qu'un esclave s'est connecté
          socket.broadcast.emit('slaveConnection', slave);
          // Lors de la deconnexion
          socket.on("disconnect", function() {
              // On parcours le tableau des esclaves pour le supprimer de la liste
              slaves.forEach((slave, index, object) => {
                  if (slave.id == socket.id) {
                      object.splice(index, 1);
                      // On notifie la vue de la deconnexion
                      socket.broadcast.emit('slaveDisconnect', slave.port);
                  }
              });
          });
      });
  });


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
