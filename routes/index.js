var keystone = require('keystone');
const passport = require('passport');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views'),
    api: importRoutes('./api')
};
const env = {
    AUTH0_CLIENT_ID: 'JTIs3X5SOh6YEAzjPdNqaCATHFvec0ch',
    AUTH0_DOMAIN: 'earmbrust.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

// Setup Route Bindings
exports = module.exports = function(app) {
    // Views
    app.get('/', routes.views.index);
    app.post('/api/buy', [ensureLoggedIn('/login')] ,routes.api.buy);
    app.post('/api/sell', [ensureLoggedIn('/login')], routes.api.sell);
    app.get('/dashboard', [
        ensureLoggedIn('/login'),
        middleware.getTransactions,
        middleware.getCurrencies,
        middleware.getOwned,
        middleware.getCurrentMoney
    ], routes.views.dashboard);




    // Perform the login
    app.get(
        '/login',
        passport.authenticate('auth0', {
            clientID: env.AUTH0_CLIENT_ID,
            domain: env.AUTH0_DOMAIN,
            redirectUri: env.AUTH0_CALLBACK_URL,
            audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
            responseType: 'code',
            scope: 'openid profile email'
        }),
        function(req, res) {
            res.redirect('/');
        }
    );

    // Perform session logout and redirect to homepage
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // Perform the final stage of authentication and redirect to '/user'
    app.get(
        '/callback',
        passport.authenticate('auth0', {
            failureRedirect: '/'
        }),
        function(req, res) {
            var userdata = req.session.passport.user._json;
            req.session.profile = userdata;
            var User = keystone.list('User');
            User.model.findOne({
                username: userdata.nickname
            }).exec(function(err, user) {
                if (!user) {
                    user = new User.model({
                        username: userdata.nickname,
                        password: userdata.sub,
                        email: userdata.email,
                        name: {
                            first: userdata.given_name,
                            last: userdata.family_name
                        },
                        money: 10000
                    });
                    user.save(function(err) {
                        req.session.user = user;
                        req.session.user.password = null;
                        res.redirect(req.session.returnTo || '/dashboard');

                    })
                } else {
                    req.session.user = user;
                    req.session.user.password = null;
                    res.redirect(req.session.returnTo || '/dashboard');
                }
            });
        }
    );


};