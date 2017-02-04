var socket = io('http://localhost:8081');

// Recuperation des serveurs deja connecte
socket.on('slaveInit', function(data) {
    // Pour chaque esclave on met a jour la vue
    data.forEach(elem => {
        addSlave(elem.port, elem.ip);
    });
});

// Lors d'une nouvelle connexion d'un esclave
socket.on('slaveConnection', function(data) {
    // On ajoute l'esclave a la vue
    addSlave(data.port, data.ip);
});

// Lors de la deconnxion d'un esclave
socket.on('slaveDisconnect', function(data) {
    //On supprime l'esclave de la vue
    $("#" + data).remove();
});

// Template pour ajouter un esclave
function addSlave(port, ip) {
    if (!$("#" + port).length) {
        $('#slaveContainer').append("<div class='slave' id='" + port + "'>" + ip + "<br>" + port + "</div>");
    }

}
