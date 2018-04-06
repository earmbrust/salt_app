var keystone = require('keystone');

exports = module.exports = function(req, res, next) {
    var Transaction = keystone.list('Transaction');
    var Currency = keystone.list('Currency');
    var User = keystone.list('User');
    Currency.model.findOne().where('symbol', req.body.type).exec(function(err, currency) {
        if (err) {
            next();
        }
        User.model.findOne().where('username', req.session.user.username).exec(function(err, user) {
            if (err || !user) {
                next(err);
            }
            var sale = new Transaction.model({
                owner: user._id,
                currency: currency._id,
                type: "SELL",
                amount: req.body.amount
            });
            sale.save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                    return;
                }
                if (req.body.type === "BTC") {
                    user.money = user.money + (currency.rateToUSD * req.body.amount);
                    user.save(function(err) {
                        req.session.user = user;
                        res.json(sale);
                    })
                } else {
                    Currency.model.findOne().where('symbol', 'BTC').exec(function(err, bitcoin) {
                        var purchase = new Transaction.model({
                            owner: user._id,
                            currency: bitcoin._id,
                            type: "BUY",
                            amount: req.body.amount * currency.rateToBTC
                        });
                        purchase.save(function () {
                        	res.json(sale);
                        })
                    });
                }
            });
        });
    });
};