// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    expressHbs = require('express3-handlebars'),
    passport = require('passport'),
    Bookshelf = require('bookshelf'),
    LocalStrategy = require('passport-local').Strategy;

// setting the template engine for express to use (Express3 Mustache)
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

// Configure Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


var env = process.env.NODE_ENV || 'staging';
if ('staging' == env || 'production' == env) {
    var port = 80;
} else if('development' == env){
    var port = 3080;
}

var router = express.Router();

//Importing Routes
require('./util/bookshelf')(Bookshelf);
require('./util/auth')(passport);
require('./routes')(router, passport);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /

app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server Listening on Port: ' + port);
