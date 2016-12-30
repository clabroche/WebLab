const http = require('http');

http.createServer((req, res) => {

    // 1. Tell the browser everything is OK (Status code 200), and the data is in plain text.
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    // 2. Send the announced text (the body of the page)
    res.end('Hello, World!\n');

}).listen(1337);