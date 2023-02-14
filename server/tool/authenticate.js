
var Users = require('../users/users.model');
var UserToken = require('../users/user_tokens.model');
const nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var config = require('../config.json');
var emailService 	= require("emailjs");
var Mailerver 	= emailService.server.connect({
    user:	config.email, 
    password: config.password, 
    host: 'smtp.gmail.com',
    port: '587',
    tls: true,
 });
const SMTPConnection = require("nodemailer/lib/smtp-connection");

exports.checkUser = function () {
    return function (req, res, next) {
        var user_id = req.headers.user_id || null;
        var token = req.headers.token || null;
        if (user_id != null && token != null) {
            //console.log('user_id =>'+user_id,'token=>'+token);
            UserToken.findOne({user_id : user_id,token:token,is_deleted:false}).populate('user_id').exec(function(err,result){
                //console.log('Check user token',result);
                if(result!=null&& result['user_id']!=undefined){
                   
                        if(result.user_id.is_verified){
                            next();
                        }else{
                            res.status(200).json({
                                'code': 401,
                                'msg': 'Account is not verified'
                            })
                        }
                }else{
                    res.status(200).json({
                        'code': 401,
                        'msg': 'Unautherization'
                    })
                }
            })
        } else {
            res.statusMessage = "Parameters are missing";
            res.status(200).json({
                'code': 401,
                'msg': 'check user_id and token.'
            })
        }
    }
}

exports.checkAdmin = function(){
    return function (req, res, next) {
        var user_id = req.headers.user_id || null;
        var token = req.headers.token || null;
        if (user_id != null && token != null) {
            UserToken.findOne({user_id : user_id,token:token,is_deleted:false}).populate('user_id').exec(function(err,result){
                if(result!=null&& result['user_id']!=undefined){
                    if(result.role =='ADMIN'){
                        next();
                    }else{
                        res.status(200).json({
                            'code': 401,
                            'msg': 'Authentication Failed'
                        })
                    }
                }else{
                    res.status(200).json({
                        'code': 401,
                        'msg': 'Token Expired'
                    })
                }
            })
        } else {
            res.statusMessage = "Parameters are missing";
            res.status(200).json({
                'code': 401,
                'msg': 'check user_id and token.'
            })
        }
    }
}


exports.sendMail = async function(to,sub,msg,callback){

        try{
            var message	= {
                text:	msg, 
                from:	"dkanojiya <support@dkanojiya.com", 
                to:		to,
                subject:	sub,
                attachment: 
                [
                   {data:`<html><p>${msg}</p></html>`, alternative:true},
                ]
             };
             Mailerver.send(message, function(err, message) { callback("Email sent"); });
             
        }catch(e){
            console.log(e);
            callback(null);
        }
      
}