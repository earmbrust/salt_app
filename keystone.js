require('dotenv').config();
var express = require('express'),
    app = express(),
    keystone = require('keystone'),
    serve = require('serve-static'),
    favicon = require('serve-favicon'),
    body = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    cron = require('node-cron')
request = require('request');

global.__basedir = __dirname;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// trust first proxy 
app.set('trust proxy', 1);

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
);
passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
    done(null, user);
});


passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(body.urlencoded({
    extended: true
}));
app.use(body.json());
app.use(multer());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates/views');

// mongoose.connect(process.env.MONGO_URI, {
//     useMongoClient: true,
//     user: process.env.MONGO_USER,
//     pass: process.env.MONGO_PASS

// });

keystone.init({
    'name': '',
    'brand': '',
    'mongo': process.env.MONGO_URI || "mongodb://localhost/your-db",
    'cookie secret': process.env.COOKIE_SECRET,
    'auto update': true,
    'session': true,
    'session store': 'mongo',
    'less': './public',
    'auth': true,
    'user model': 'User',
    'admin path': 'admin'
});

keystone.import('models');

// Serve your static assets
app.use(serve('./public'));


keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});

keystone.set('admin path', 'admin');


var routes = require('./routes')(app);
// keystone.set('routes', require('./routes'));
keystone.set('routes', app);
// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    users: 'users',
    transactions: 'transactions',
    currencies: 'currencies'
        // requests: 'requests'
});



cron.schedule('* * * * *', function() {
    var Currencies = keystone.list('Currency');
    Currencies.model.find().exec(function(err, currencies) {
        currencies.forEach(function(currency, index, collection) {
            request('https://min-api.cryptocompare.com/data/price?fsym=' + currency.symbol + '&tsyms=USD,BTC', function(error, response, body) {
                var bodyData = JSON.parse(body);
                currency.rateToUSD = bodyData.USD;
                currency.rateToBTC = bodyData.BTC;
                currency.save();
            });
        })
    });

    // https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR
});


// Start Keystone to connect to your database and initialise the web server
keystone.start();