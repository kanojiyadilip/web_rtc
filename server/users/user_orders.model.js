var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userOrdersSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Users'
    },
    payment_for: {
        type: String,
        enum: ['COINS', 'SONGS'],
        default: 'COINS'
    },
    Payment_sorce: {
        type: String
    },
    order_id: {
        type: String
    },
    total_amt: {
        type: String
    },
    total_item: {
        type: String
    },
    currency: {
        type: String
    },
    Payment_status: {
        type: String
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

module.exports = mongoose.model('Userorders', userOrdersSchema);
