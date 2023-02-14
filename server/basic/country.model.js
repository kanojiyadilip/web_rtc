var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },   
    active:{
        type: Boolean,
        default: true
    },     
});

module.exports = mongoose.model('countrys', countrySchema);
