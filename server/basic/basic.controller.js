const express = require('express');
const router = express.Router();

var basicService = require('./basic.service');

router.get('/get_all_country_state', getAllCountryState);
router.post('/add_bank_detail', addBankDetail);
router.post('/get_bank_detail', getBankDetail);

module.exports = router;

function getAllCountryState(req, res){
    basicService.getAllCountryState(req.body, function(result){
        if (result instanceof Error) {
            res.status(200).json(result)
        }
        // if there is no error
        else {
            res.status(200).json(result)
        }        
    })
}

function addBankDetail(req, res){
    basicService.addBankDetail(req.body, function(result){
        if (result instanceof Error) {
            res.status(200).json(result)
        }
        // if there is no error
        else {
            res.status(200).json(result)
        }        
    })
}

function getBankDetail(req, res){
    basicService.getBankDetail(req.body, function(result){
        if (result instanceof Error) {
            res.status(200).json(result)
        }
        // if there is no error
        else {
            res.status(200).json(result)
        }        
    })
}