var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userWalletsSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Users'
    },
    total_coins: {
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

module.exports = mongoose.model('Userwallets', userWalletsSchema);
