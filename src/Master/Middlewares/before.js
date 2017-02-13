let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


function middlewares(express, app, io) {
    app.use(function(req, res, next) {
        res.io = io;
        next();
    });
    app.use(express.static(path.join(path.dirname(require.main.filename), '/public')));


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



}

module.exports = middlewares
