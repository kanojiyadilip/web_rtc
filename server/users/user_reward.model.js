var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserReward = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Users'
    },
    contest_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Contests'
    },
    song_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Songs'
    },
    coins: {
        type: Number
    },
    active:{
        type: Boolean,
        default: true
    },
    created_on: {
        type: Date,
        default: new Date()
    },
    updated_on: {
        type: Date,
        default: new Date()
    },        
});

module.exports = mongoose.model('UserReward', UserReward);
