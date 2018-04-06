var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Transaction Model
 * ==========
 */
var Transaction = new keystone.List('Transaction');

Transaction.add({
    owner: {
        type: Types.Relationship,
        ref: 'User',
        noedit: true
    },
    currency: {
        type: Types.Relationship,
        ref: 'Currency',
        noedit: true
    },
    type: {
        type: Types.Select,
        options: ['BUY', 'SELL'],
        noedit: true
    },
    amount: {
        type: Types.Number,
        require: true,
        noedit: true
    },
    date: {
        type: Types.Datetime,
        default: Date.now,
        noedit: true
    }
});

/**
 * Registration
 */
Transaction.defaultColumns = 'owner, currency, type, amount';
Transaction.register();