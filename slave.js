let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let rp = require('request-promise');
let ip = require('ip');
let findPort = require('find-port');

let index = require('./src/Slave/routes/index');
let users = require('./src/Slave/routes/users');

let express = require('express');

let app = express();
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

app.set('views', __dirname + '/src/Slave/Views');
app.set('twig options', {
    strict_variables: false,
});

app.set('view engine', 'twig');

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

findPort('localhost', 8082, 8200, function(ports) {
    let port = ports[0];
    let options = {
        method: 'POST',
        uri: 'http://localhost:8081/registerSlave',
        body: {
            ip: ip.address(),
            port: port
        },
        json: true
    };
    rp(options).then((parsedBody) => {
        console.log(parsedBody);
    });
    app.listen(port);
});
