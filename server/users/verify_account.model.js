var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VerifySchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
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
    }
});
module.exports = mongoose.model('VerifyToken', VerifySchema);
