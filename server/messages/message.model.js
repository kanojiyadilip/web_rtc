var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messagesSchema = new Schema({
    sender_id:{
        type: Schema.Types.ObjectId, 
        ref: 'Users'
    },
    receiver_id:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    message: {
        type: String
    },
    active:{
        type: Boolean,
        default: true
    },    
    created_timestamp: {
        type: Number,
        default: new Date().valueOf()
    },
    updated_timestamp: {
        type: Number,
        default: new Date().valueOf()
    } 
});

module.exports = mongoose.model('Messages', messagesSchema);
