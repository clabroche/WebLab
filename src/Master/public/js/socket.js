var socket = io('http://localhost:8081');

// Recuperation des serveurs deja connecte
socket.on('slaveInit', function(slaves) {
    // Pour chaque esclave on met a jour la vue
    slaves.forEach(slave => {
        addSlave(slave.port, slave.ip);
    });
});

// Lors d'une nouvelle connexion d'un esclave
socket.on('slaveConnection', function(slave) {
    // On ajoute l'esclave a la vue
    addSlave(slave.port, slave.ip);
});

// Lors de la deconnxion d'un esclave
socket.on('slaveDisconnect', function(port) {
    //On supprime l'esclave de la vue
    $("#" + port).remove();
});

// Template pour ajouter un esclave
function addSlave(port, ip) {
    if (!$("#" + port).length) {
      let title = $('<h1>').text(ip+':'+port);
      let slave = $("<div>").addClass('slave').prop("id",port);
      $('#slaveContainer').append(slave.append(title));
    }

}
