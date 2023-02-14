var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserTokensSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users'
    },
    token: String,
    provider_token: String,
    is_deleted: {
        type: Boolean,
        default: false
    },
    created_on: {
        type: Date,
        default: new Date()
    },
    created_timestamp: {
        type: Number,
        default: new Date().valueOf()
    },
    updated_on: {
        type: Date,
        default: new Date()
    },
    updated_timestamp: {
        type: Number,
        default: new Date().valueOf()
    }
}, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });
module.exports = mongoose.model('UserTokens', UserTokensSchema);
