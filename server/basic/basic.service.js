var indianStateSchema = require('./india_state.model');
var countrySchema = require('./country.model');
var tourPackageSchema = require('./tour_package.model');
var bankSchema = require('./bank.model');

const shortid = require('shortid');
var fs = require('fs');
var mongoose = require('mongoose');

module.exports = {
    getAllCountryState,
    addBankDetail,
    getBankDetail
}

function getAllCountryState(data, callback){

    indianStateSchema.find({}).exec(function(err, state){
        countrySchema.find({}).exec(function(err, country){
            tourPackageSchema.find({}).exec(function(err, pack){
                // console.log("doc---->", doc);
                callback({
                    code: 200,
                    msg: 'get All Country State',
                    data: {state: state, country: country, tourPack: pack}
                })
            })
        })
    })
}

function addBankDetail(data, callback){
    // console.log("----data-----", data);
    if(data.id && data.id !== 'undefined'){
        bankSchema.findById(data.id, function(err, doc){
            if(doc){
                doc.account_name = data.account_name || '',
                doc.account_no = data.account_no  || '',
                doc.bank_name = data.bank_name  || '',
                doc.branch_address = data.branch_address  || '',
                doc.branch_code = data.branch_code  || '',
                doc.ifc_code = data.ifc_code || '',
                doc.save(function(err, result){
                    if(result){
                        callback({
                            code: 200,
                            msg: 'Bank Detail Edit Successfully',
                            data: doc
                        })
                    }
                    else{
                        callback({
                            code: 400,
                            msg: 'Somthing went wrong.'
                        })  
                    }
                })
            }
        })
    }
    else{
        var bank = new bankSchema({
            account_name: data.account_name,
            account_no: data.account_no,
            bank_name: data.bank_name,
            branch_address: data.branch_address,
            branch_code: data.branch_code,
            ifc_code: data.ifc_code,
        }).save( function(err, doc){
            if(doc){
                callback({
                    code: 200,
                    msg: 'Bank Detail Add Successfully',
                    data: doc
                })
            }
            else{
                callback({
                    code: 400,
                    msg: 'Somthing went wrong.'
                })  
            }
        });
    }
}

function getBankDetail(data, callback){
    console.log("data=->", data);
    data.id = data.id =='undefined' ? undefined : data.id;
    var query = data.id != undefined ? bankSchema.findById(data.id) : bankSchema.find({});
    // console.log("query=->", query);
    query.exec(function(err, doc){
        console.log("doc=->", doc);
        if(doc){
            callback({
                code: 200,
                msg: 'Get Bank Detail Successfully',
                data: doc
            })
        }
        else{
            callback({
                code: 400,
                msg: 'Somthing went wrong.'
            })
        }
    })
}


var variable1 = null;

variable2 = "dilip";
console.log("variable1----->",variable1)
 variable2 = !variable1  || 'new';

console.log("variable2----->",variable2)