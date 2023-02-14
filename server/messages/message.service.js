var messageSchema = require('./message.model');
const shortid = require('shortid');
var fs = require('fs');
var mongoose = require('mongoose');
var async = require("async");


module.exports = {
    sendMessages,
    getMessageByUser,
}

// if(data.tour_img !== undefined){
//     console.log("data.user_img===-=1-=-=>", data.tour_img)
//     if(data.tour_img === 'undefined'){
//     }
//     else{
//         var pic = '/tour_img/' + (shortid.generate()) + '_' + Date.now() + '.png';
//         const base64Data = data.tour_img.replace(/^data:([A-Za-z-+/]+);base64,/, '');
//         fs.writeFileSync(appDir + "/assets" + pic, base64Data, 'base64', function (err) {
//         })
//         tourData.tour_img = '/assets' + pic;
//     }
// }

function sendMessages(dataReq, callback){
    console.log("-<dataReq>-", dataReq);
    var data = {
        sender_id: dataReq.sender_id,
        receiver_id: dataReq.receiver_id
    }
    if(dataReq.image){
        var pic = '/chat_img/chat_' + (shortid.generate()) + '_' + Date.now() + '.png';
        const base64Data = dataReq.image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        fs.writeFileSync(appDir + "/assets" + pic, base64Data, 'base64', function (err) {
        })
        console.log("pic===-=1-=-=>", pic)
        data.message = '/assets' + pic;
    }
    else{
            data.message =  dataReq.message
    }        
    

    console.log("-<tourData>-", data);

   var msgModel = new messageSchema(data).save(function(err, doc){
        if(doc){
            callback({
                code: 200,
                msg: 'mesg Post Successfully',
                data: doc
            })
        }
        else{
            console.log("err->", err);
            callback({
                code: 400,
                msg: 'Somthing went wrong.'
            })    
        }
   })
}

function getMessageByUser(data, callback){
    console.log("data------->", data);
    messageSchema.aggregate([
        {   $match: {  $or: [
                    {
                        receiver_id: mongoose.Types.ObjectId(data.receiver_id), 
                        sender_id: mongoose.Types.ObjectId(data.sender_id), 
                        active : true
                    },
                    { 
                        
                        receiver_id: mongoose.Types.ObjectId(data.sender_id), 
                        sender_id: mongoose.Types.ObjectId(data.receiver_id), 
                        active : true
                    },                
                ]
            }    
        },            
        {$lookup: { from: "users", localField: "receiver_id", foreignField: "_id", as: "receiverUser" }}
    ]).exec(function(err, doc){
        if(doc){
            callback({
                code: 200,
                msg: 'get message Successfully',
                data: doc
            })
        }
        else{
            callback({
                code: 400,
                msg: 'Data not found',
            })  
        }
    })
}