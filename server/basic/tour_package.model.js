var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tourPackageSchema = new mongoose.Schema({
    name: {
        type: String
    },
    active:{
        type: Boolean,
        default: true
    }  
});

module.exports = mongoose.model('tourpackages', tourPackageSchema);
