/**
 * SERVER.JS
 * MAIN FILE
 * @author Xavier CHOPIN, Corentin LABROCHE, David LEBRUN, Maxence ANTOINE
 * @license    MIT (3-clause)
 * @copyright  (c) 2016-2017 University of Lorraine
 * @link       http://github.com/tpcisiie/weblab
 */


let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var rp = require('request-promise');
var ip = require('ip');


let index = require('./src/Slave/routes/index');
let users = require('./src/Slave/routes/users');

let express = require('express');
let app = express();

app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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



let port = 3001;

var options = {
    method: 'POST',
    uri: 'http://localhost:8081/registerSlave',
    body: {
        ip: ip.address(),
        port: port
    },
    json: true // Automatically stringifies the body to JSON
};

rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody);
    })
    .catch(function (err) {
        // POST failed...
    });

















app.listen(port);
