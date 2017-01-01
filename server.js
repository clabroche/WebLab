let app = require('express')();

app.get('/', (request, response) => {
    response.send('Hello world !');
});

app.listen(8080);