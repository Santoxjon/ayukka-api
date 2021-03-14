var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const chalk = require('chalk');

var indexRouter = require('./routes/index');
var columnsRouter = require('./routes/columns');
var tasksRouter = require('./routes/tasks');

const cors = require('cors');

var app = express();
app.use(cors());

require('dotenv').config();

const mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/columns', columnsRouter);
app.use('/columns/tasks', tasksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

console.log(chalk.rgb(255,255,255).bgMagenta.underline(`Conectando a  -> ${process.env.MONGODB_LOCATION}`));
MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => { 
    if (err !== null) {
      console.log(err);
    } else {
      app.locals.db = client.db("ayukkadb");
      console.log(chalk.black.bgGreenBright.underline(`Conectado!`));
    }
  });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
