var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
var connectLivereload = require("connect-livereload");
const livereload = require('livereload');

const mainRouter = require('./routes/main'); // Rutas main
const productsRouter = require('./routes/products'); // Rutas /products
const usersRouter = require('./routes/users'); // Rutas /users

const logsMiddleware = require('./middlewares/logsMiddleware'); // Middleware de logs

var app = express();
app.use(connectLivereload());
//app.use(logsMiddleware);

app.use('/assets', [
  express.static(__dirname + '../../public'),
  express.static(__dirname + '../../build/js'),
  express.static(__dirname + '../../node_modules/material-design-icons/iconfont/'),
  express.static(__dirname + '../../node_modules/jquery/dist/'),
  express.static(__dirname + '../../node_modules/bootstrap/dist/js/')
]);
app.use(session({
  secret: 'Secret modafocka!',
  resave: true,
  saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, '../build')));
var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, '../build'));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


app.use('/', mainRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
