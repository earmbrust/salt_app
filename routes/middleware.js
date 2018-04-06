var _ = require('lodash');
var keystone = require('keystone');

/**
	Initialises the standard view locals
*/
exports.initLocals = function(req, res, next) {
    res.locals.navLinks = [{
        label: 'Home',
        key: 'home',
        href: '/'
    }, ];
    res.locals.user = req.user;
    next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function(req, res, next) {
    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error'),
    };
    res.locals.messages = _.some(flashMessages, function(msgs) {
        return msgs.length;
    }) ? flashMessages : false;
    next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'Please sign in to access this page.');
        res.redirect('/keystone/signin');
    } else {
        next();
    }
};


exports.getTransactions = function(req, res, next) {
    var Transactions = keystone.list('Transaction');
    Transactions.model.find().where('owner', req.session.user._id).exec(function(err, transactions) {
        if (err) {
            next();
        }
        res.locals.transactions = transactions;
        next();
    });
}

exports.getCurrencies = function(req, res, next) {
    var Currencies = keystone.list('Currency');
    Currencies.model.find().exec(function(err, currencies) {
        if (err) {
            next();
        }
        res.locals.currencies = currencies;
        next();
    });
}

exports.getCurrentMoney = function(req, res, next) {
    var User = keystone.list('User');
    User.model.findOne({
        _id: req.session.user._id
    }).exec(function(err, user) {
        req.session.user.money = user.money;
        next();
    });
}

exports.getOwned = function(req, res, next) {
    var Transactions = keystone.list('Transaction');
    Transactions.model.find().where('owner', req.session.user._id).exec(function(err, transactions) {
        if (err) {
            next();
        }
        var Currencies = keystone.list('Currency');
        Currencies.model.find().exec(function(err, currencies) {
            if (err) {
                next();
            }
            var owned = {};
            currencies.forEach(function(currency, index) {
                owned[currency.symbol] = 0;
            });
            transactions.forEach(function(transaction, index) {
                var value = transaction.amount;
                switch (transaction.type) {
                    case "BUY":
                        currencies.forEach(function(currency, index) {
                            if (currency._id.toString() === transaction.currency.toString()) {
                                owned[currency.symbol] += transaction.amount;
                            }
                        });
                        break;
                    case "SELL":
                        currencies.forEach(function(currency, index) {
                            if (currency._id.toString() === transaction.currency.toString()) {
                                owned[currency.symbol] -= transaction.amount;
                            }
                        });
                        break;
                }
            });
            res.locals.owned = owned;
            next();
        });
    });
}