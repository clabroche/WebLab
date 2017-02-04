var socket = io('http://localhost:8081');
socket.on('slaveConnection', function(data) {
    addSlave(data.port, data.ip);
});

socket.on('slaveDisconnect', function(data) {
    $("#" + data).remove();
});

socket.on('slaveInit', function(data) {
    data.forEach(elem => {
        addSlave(elem.port, elem.ip);
    });
});

function addSlave(port, ip) {
    if (!$("#" + port).length) {
        $('#slaveContainer').append("<div class='slave' id='" + port + "'>" + ip + "<br>" + port + "</div>");
    }

}
