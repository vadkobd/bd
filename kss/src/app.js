'use strict';
var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var home = require('./routes/home');
var users = require('./routes/users');

//
var app = express();

//
var config = require('./lib/config');


// view engine setup
var exphbs = require('express-handlebars');

var stylus = require('stylus');
var nib = require('nib');

if (!config().html.css.stylusPrecompile) {
  app.use(
    stylus.middleware({
      src: __dirname + '/stylus',
      dest: __dirname + '/public/css',
      compile: function(str, path) {
        return stylus(str)
                .set('filename', path)
                .set('compress', config().html.css.compress)
                .set(nib());
      }
    })
  );
}

app.engine(config().views.engine, exphbs({
  extname:config().views.extension,
  defaultLayout: config().views.layout,
  layoutsDir:__dirname + '/views/layouts',
  partialsDir:__dirname + '/views/partials'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

if(!!module.parent)
{
  module.exports = app;
}
else
{
  app.listen(config().serverPort);
}

