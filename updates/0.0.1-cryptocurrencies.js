/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

exports.create = {
	Currency: [
		{ 'title': 'Bitcoin', 'symbol': 'BTC', 'rateToUSD': 0.0, 'rateToBTC': 1.0, 'crypto': true},
		{ 'title': 'Litecoin', 'symbol': 'LTC', 'rateToUSD': 0.0, 'rateToBTC': 0.0, 'crypto': true},
		{ 'title': 'Dogecoin', 'symbol': 'DOGE', 'rateToUSD': 0.0, 'rateToBTC': 0.0, 'crypto': true},
		{ 'title': 'Monero', 'symbol': 'XMR', 'rateToUSD': 0.0, 'rateToBTC': 0.0, 'crypto': true},
		{ 'title': 'U.S. Dollar', 'symbol': 'USD', 'rateToUSD': 1.0, 'rateToBTC': 0.0, 'crypto': false},
	],
};
