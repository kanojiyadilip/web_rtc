var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Users'
    },
    name: {
        type: String
    },
    bio: {
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

module.exports = mongoose.model('Artists', artistSchema);
