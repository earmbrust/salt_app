var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
    name: {
        type: Types.Name,
        required: true,
        index: true
    },
    email: {
        type: Types.Email,
        initial: true,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: Types.Text,
        required: true,
        initial: true,
        unique: true,
        index: true
    },
    money: {
        type: Types.Money,
        format: '$0,0.00',
        currency: 'en-us'
    },
    password: {
        type: Types.Password,
        initial: true,
        required: true
    },
}, 'Permissions', {
    isAdmin: {
        type: Boolean,
        label: 'Can access Keystone',
        index: true
    },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();