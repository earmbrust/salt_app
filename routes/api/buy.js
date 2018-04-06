var keystone = require('keystone');

exports = module.exports = function(req, res, next) {
    var Transaction = keystone.list('Transaction');
    var Currency = keystone.list('Currency');
    var User = keystone.list('User');
    Currency.model.findOne().where('symbol', req.body.type).exec(function(err, currency) {
        if (err) {
            next();
        }
        User.model.findOne().where('_id', req.session.user._id).exec(function(err, user) {
            var purchase = new Transaction.model({
                owner: user._id,
                currency: currency._id,
                type: "BUY",
                amount: req.body.amount / currency.rateToBTC
            });
            purchase.save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                    return;
                }
                if (req.body.type === "BTC") {
                    user.money = user.money - (currency.rateToUSD * req.body.amount);
                    user.save(function(err) {
                        req.session.user = user;
                        res.json(purchase);
                    });
                } else {
                    Currency.model.findOne().where('symbol', 'BTC').exec(function(err, currency) {
                        var sale = new Transaction.model({
                            owner: user._id,
                            currency: currency._id,
                            type: "SELL",
                            amount: req.body.amount
                        });
                        sale.save(function(err) {
                            res.json(purchase);
                        });
                    });
                }
            });
        });
    });
};