var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bankSchema = new mongoose.Schema({
    account_name: {
        type: String
    },
    account_no: {
        type: String
    },   
    bank_name: {
        type: String
    },  
    branch_address: {
        type: String
    },  
    branch_code: {
        type: String
    },  
    ifc_code: {
        type: String
    },  
    active:{
        type: Boolean,
        default: true
    },     
});

module.exports = mongoose.model('banks', bankSchema);
