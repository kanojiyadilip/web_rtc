var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

var fs = require('fs');
var _ = require('lodash');
var generatePassword = require('../tool/generate_password');
var sendMail = require('../tool/authenticate').sendMail;

var Users = require('./users.model');
var UserService = require('./users.service');

var checkUser = require('../tool/authenticate').checkUser;
var middleware = require('../middleware');
router.post('/login', loginUser);
router.post('/social_login', updateSocialLogin);
router.post('/register', registerUser);
router.post('/reset_password',checkUser(), resetPassword);
router.put('/update_profile',checkUser(),updateProfile);
router.put('/change_password',checkUser(),updatePassword);
router.get('/verify_email/:token',verify_email);
router.post('/dashboard',checkUser(), dashboard);
router.post('/artist_detail', checkUser(), artistDetail);
router.post('/purchase_coin', checkUser(), purchaseCoin);
router.post('/user_all_data', checkUser(), userAllData);
router.post('/user_upcomming_contest', upCommingContest);
router.post('/update_user_profile', updateUserProfile);
router.post('/get_all_users', getAllUsers);
router.post('/add_user', add_user);
router.post('/search_user', search_user);

module.exports = router;

function loginUser(req,res){
    console.log("req.body-------login_user-------->", req.body);
    var username = req.body.username!=undefined?req.body.username.trim().toLowerCase():'' || '';
    var password = req.body.password!=undefined?req.body.password.trim():''||'';
    if (username != null && password != null) {
        UserService.login({username: username,password:password}, function (result) {
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
    else {
        // empty body
        res.status(200).json({
            'code': 405,
            'msg': "parameters missing"
        })
    }

        
}

function registerUser(req,res,next){
     var data = {
         username : req.body.email!=undefined?req.body.email.trim().toLowerCase():'' || '',
         password : req.body.password!=undefined?req.body.password.trim():'' || '',
         orgname : req.body.orgname!=undefined?req.body.orgname.trim():'' || ''
     }
     UserService.register(data,function(result){
         res.status(200).json(result);
     })  
}

function resetPassword(req,res,next){
    var data = {
        username : req.body.username!=undefined?req.body.username.trim().toLowerCase():'' || ''
    }
    UserService.resetPassword(data,function(result){
        res.status(200).json(result);
    })
}

function updateProfile(req,res,next){
    var data = {
        user_id : req.headers.userid!=undefined?req.headers.userid.trim():'' || '',
        first_name : req.body.first_name!=undefined?req.body.first_name.trim():'' || '',
        last_name : req.body.last_name!=undefined?req.body.last_name.trim():'' || '',
    }
    UserService.updateProfile(data,function(result){
        res.status(200).json(result);
    })
}

function updatePassword(req,res,next){
    var data = {
        user_id : req.headers.userid!=undefined?req.headers.userid.trim():'' || '',
        old_pass : req.body.old_pass!=undefined?req.body.old_pass.trim():'' || '',
        new_pass : req.body.new_pass!=undefined?req.body.new_pass.trim():'' || '',
    }
    UserService.updatePassword(data,function(result){
        res.status(200).json(result);
    })
}

function verify_email(req,res,next){
    var data = {
        token : req.params.token!=undefined?req.params.token.trim():'' || '',
    }
    UserService.verify_account(data,function(result){
        res.status(200).json(result);
    })
}

function sendMailDemon(req,res){
    sendMail('akasha3001@gmail.com','Mail Test',"Success",function(result){
        res.status(200).json({
            code : 200,
            msg : 'Mail sent'
        });
    })
}

function updateSocialLogin(req,res){
    console.log('update social login controller');
    var data = {
        email : req.body.email!=undefined?req.body.email.trim():'' || '',
        provider_id : req.body.provider_id!=undefined?req.body.provider_id.trim():'' || '',
        provider : req.body.provider!=undefined?req.body.provider.trim():'' || '',
        profile_pic : req.body.profile_pic!=undefined?req.body.profile_pic.trim():'' || '',
        name : req.body.name!=undefined?req.body.name:'' || '',
        provider_token : req.body.provider_token!=undefined?req.body.provider_token.trim():'' || '',
    }
    console.log('update social login')
    UserService.updateToken(data,function(result){
        res.status(200).json(result);
    })
}

function dashboard(req, res){

    if(typeof req.body.user_id == 'undefined'){
        var obj ={ "code": 400, "msg": "user_id is not provided"}
        res.status(200).json(obj);
    }
    else{    
        var data = {
            user_id: req.body.user_id
        };
        UserService.dashboard(data, function(result){
            res.status(200).json(result);
        })
    }    
}

function artistDetail(req, res){

    if(typeof req.body.user_id == 'undefined'){
        var obj ={ "code": 400, "msg": "user_id is not provided"}
        res.status(200).json(obj);
    }
    else{
        var data = {
            user_id: req.body.user_id
        };
        UserService.artistDetail(data, function(result){
            res.status(200).json(result);
        })
    }    
}

function purchaseCoin(req, res){
    var data = {
        user_id: req.body.user_id,
        token: req.body.token,
        coins: req.body.coins
    };
    console.log("data=>",data);
    UserService.purchaseCoin(data, function(result){
        res.status(200).json(result);
    })
}

function userAllData(req, res){
    var data = {user_id: req.body.user_id};
    console.log("data=>",data);
    UserService.userAllData(data, function(result){
        res.status(200).json(result);
    })
}

function upCommingContest(req, res) {

    if(typeof req.body.user_id == 'undefined'){
        var obj ={ "code": 400, "msg": "user_id is not provided"}
        res.status(200).json(obj);
    }
    else{    
        var data = {
            user_id: req.body.user_id,
            skip: req.body.skip 
        };
        UserService.upCommingContest(data, function(result){
            res.status(200).json(result);
        })
    }
}

function updateUserProfile(req, res) {

    if(typeof req.body.user_id == 'undefined'){
        var obj ={ "code": 400, "msg": "user_id is not provided"}
        res.status(200).json(obj);
    }
    else{    
        console.log("req.protocol + '://' + req.get('host')======>", req.protocol + '://' + req.get('host'));
        var data = {
            user_id: req.body.user_id,
            name : req.body.name,
            contact_email : req.body.contact_email,
            fb_link : req.body.fb_link,
            insta_link : req.body.insta_link,
            twitter_link : req.body.twitter_link,
            youtube_link : req.body.youtube_link,
            user_img : req.body.user_img,
            base_url: req.protocol + '://' + req.get('host')
        };
        UserService.updateUserProfile(data, function(result){
            res.status(200).json(result);
        })
    }
}


function getAllUsers(req, res){
    var data = {user_id: req.body.user_id};
    console.log("data=>",data);
    UserService.getAllUsers(data, function(result){
        res.status(200).json(result);
    })
}




function add_user(req,res,next){
    var data = {
        email : req.body.email!=undefined?req.body.email.trim().toLowerCase():'' || '',
        password : req.body.password!=undefined?req.body.password.trim():'' || '',
        name : req.body.name!=undefined?req.body.name:'' || '',
        profile_pic: req.body.profile_pic
        // name : req.body.name!=undefined?req.body.name.trim():'' || ''
    }
    UserService.addUser(data,function(result){
        res.status(200).json(result);
    })  
}

function search_user(req,res,next){
    var data = {
        key : req.body.key!=undefined?req.body.key.trim().toLowerCase():'' || ''
    }
    if(data.key){
        UserService.search_user(data,function(result){
            res.status(200).json(result);
        })  
    }
    else{
        res.status(200).json({
            'code': 405,
            'msg': "parameters missing"
        })        
    }
}