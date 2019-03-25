var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs=require('express-handlebars')
var mongoose=require('mongoose')
var session=require('express-session')
var passport=require('passport')
var flash=require('connect-flash')
var validator=require('express-validator')
//storing session in connect-mongo package
var mongoStore=require('connect-mongo')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user'); 

var app = express();

var url = process.env.DATABASE_URL || "mongodb://localhost:27017/shopping21"; 
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log("Connection Successful"))
    .catch(err => console.log(err));
//mongoose.connect('localhost:27017/myEmployee',{useNewUrlParser: true});
let db=mongoose.connection
console.log(db)
db.once('open',function(){
    console.log('connected to mongodb')
})
db.on('error',function(err){
    console.log(err)
})

require('./config/passport')
// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator())
app.use(cookieParser());
app.use(session({
  secret:'mysecret',
  resave:false,
  saveUninitialized:false,
  store:new mongoStore({mongooseConnection:mongoose.connection}),
  cookie:{maxAge:1440*60*1000}
})
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  //login and session are global variables available to all views file
  res.locals.login=req.isAuthenticated()
  res.locals.session=req.session
  next()
})
app.use('/user', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next){
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
