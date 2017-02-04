let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let index = require('./src/Master/routes/index');
let users = require('./src/Master/routes/users');

let express = require('express');

let app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// app.use(require('node-sass-middleware')({
//     src: path.join(__dirname, 'public'),
//     dest: path.join(__dirname, 'public'),
//     indentedSyntax: true,
//     sourceMap: true
// }));

app.set('views', __dirname + '/src/Master/Views');
app.set('twig options', {
    strict_variables: false,
});

app.set('view engine', 'twig');

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.render('error');
});












var allClients = [];
io.on('connection', function (socket) {
  socket.emit('slaveInit', allClients);
  socket.on('slaveConnection', function (data) {

    socket.port = data.port;
    socket.ip = data.ip;
    allClients.push({ip:data.ip,port:data.port,id:socket.id});
    socket.broadcast.emit('slaveConnection', data);
    socket.on("disconnect",function () {
      allClients.forEach((client,index,object) => {
        if (client.id == socket.id) {
          socket.broadcast.emit('slaveDisconnect', client.port);
          object.splice(index, 1);
        }
      });


      console.log(allClients.length);
    });
  });
});
















server.listen(8081);
