var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Currency Model
 * ==========
 */
var Currency = new keystone.List('Currency', {
    map: {
        name: 'title'
    }
});

Currency.add({
    symbol: {
        type: Types.Text,
        required: true,
        index: true,
        unique: true,
        initial: true
    },
    title: {
        type: Types.Text,
        required: true,
        index: true,
        initial: true
    },
    rateToUSD: {
        type: Types.Number
    },
    rateToBTC: {
        type: Types.Number
    },
    crypto: {
        type: Types.Boolean
    }
});

/**
 * Registration
 */
Currency.defaultColumns = 'title, symbol, rateToUSD, rateToBTC';
Currency.register();