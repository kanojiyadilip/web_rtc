var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: false,
        lowercase : true
    },
    name: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String,
    },
    password: {
        type: String,
        default: ''
    },
    salt: String,
    is_live:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum : ['USER','ADMIN'],
        default: 'USER'
    },
    token: String,
    provider_id : String,
    provider : String,
    profile_pic : String,
    is_user: {
        type: String,
        enum: ['USER', 'ARTIST'],
        default: 'USER'
    },
    contact_email: {
        type: String,
    },    
    fb_link : {
        type : String,
        default : ''
    },
    insta_link : {
        type : String,
        default : ''
    },
    twitter_link : {
        type : String,
        default : ''
    },
    youtube_link : {
        type : String,
        default : ''
    },
    address: String,
    city: String,
    state: String,
    country: String,
    pin: String,
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_confirmed: {
        type: Boolean,
        default: false
    },
    last_login: {
        type: Number
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

module.exports = mongoose.model('Users', UserSchema);
