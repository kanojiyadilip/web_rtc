const express = require('express');
const router = express.Router();

var messagesService = require('./message.service');

router.post('/save_message', saveMessage);
router.post('/get_message_by_user', getMessageByUser);

module.exports = router;

function saveMessage(req,res){
   console.log("-<>-", req.body);
    if (req.boy.name == undefined 
        || req.body.sender_id == undefined 
        || req.body.receiver_id == undefined 
        || req.body.message == undefined ) {

        res.status(200).json({
            'code': 405,
            'msg': "parameters missing"
        })
    }
    else {

        messagesService.saveMessage(req.body, function (result) {
            // if error is there
            if (result instanceof Error) {
                res.status(200).json(result)
            }
            // if there is no error
            else {
                res.status(200).json(result)
            }
        })
    }

        
}


function getMessageByUser(req,res){
    messagesService.getMessageByUser(req.body, function (result) {
        // if error is there
        if (result instanceof Error) {
            res.status(200).json(result)
        }
        // if there is no error
        else {
            res.status(200).json(result)
        }
    })
}