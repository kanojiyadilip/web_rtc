var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('lodash');
var config = require('../config.json');
var generatePassword = require('../tool/generate_password');
const shortid = require('shortid');
var validator = require("email-validator");
var sendMail = require('../tool/authenticate').sendMail;
var randomstring = require("randomstring");
const axios = require('axios');
var async = require("async");
// const stripe = require('stripe')('sk_test_tyCp4YGEFhSxwOetCB8WT1Ao00vRresr1q');

var Users = require('./users.model');
var Messages = require('../messages/message.model');
var UserTokens = require('./user_tokens.model');
var VerifyTokens = require('./verify_account.model');
var UserOrsers = require('./user_orders.model');
var Userwallets = require('./user_wallets.model');

// var Contests = require('../contests/contests.model');
// var ContestParticipent = require('../contests/contest_participants.model');
// var Songs = require('../songs/songs.model');
// var Genres = require('../genres/genres.model');
// var FavoriteGenres = require('../genres/favorite_genres.model');
// var Reviews = require('../songs/reviews.model');
// var Artists = require('./artists.model');
// var Setting = require('../settings/settings.model');
// var ContestWinners = require('../contests/contest_winners.model');
// var SongPlayedHistory = require('../songs/song_history.model');
module.exports = {
    addAdmin,
    login,
    updatePassword,
    updateProfile,
    resetPassword,
    updateToken,
    dashboard,
    artistDetail,
    purchaseCoin,
    userAllData,
    upCommingContest,
    updateUserProfile,
    getAllUsers,
    addUser,
    search_user,
    thisUserOnline
}

function addAdmin(data, callback) {
    Users.findOne({
        email: data.email,
        is_deleted: false
    }).exec(function (err, result) {
        if (result != null) {
            callback({
                code: 200,
                msg: 'Admin User Refetched'
            })
        } else {
            var user = {
                email: data.email != undefined ? data.email.trim() : '' || '',
                password: data.password != undefined ? data.password.trim() : '' || '',
                role: 'ADMIN',
                first_name: 'admin',
                last_name: '',
                is_verified: true,
                is_confirmed: true,
            }
            if (validator.validate(user.email) != '' && user.password != '') {
                var hashPassword = generatePassword.createHash(user.password);
                user.password = hashPassword.hash;
                user.username = user.email;
                Users.create(user, function (err, result) {
                    if (result != null) {
                        callback({
                            code: 200,
                            msg: 'Admin User Created'
                        })
                    } else {
                        ////console.log('Error', err);
                        callback({
                            code: 405,
                            msg: 'Failed to create admin user! Please check email or password'
                        })
                    }
                })
            } else {
                callback({
                    code: 405,
                    msg: 'Failed to create admin user! Please check email or password'
                })
            }
        }
    })
}

function login(data, callback) {
    Users.findOne({
        $or: [{
            username: data.username
        },
        {
            email: data.username
        }
        ],
        is_deleted: false
    }).lean().exec(function (err, userdata) {

        if (userdata == null) {
            ////console.log(err);
            callback({
                code: 405,
                msg: 'No user found with this Email'
            })
        } else {
            var checked = generatePassword.validateHash(userdata.password, data.password)
            if (checked) {
                if (userdata.role == 'ADMIN') {
                    updateUserTokenAndSendResponse(userdata, callback);
                } else {
                    if (userdata.is_verified) {
                        if (userdata.is_confirmed) {
                            updateUserTokenAndSendResponse(userdata, callback);
                        } else {
                            callback({
                                code: 405,
                                msg: 'Your account is not confirmed. Please contact to admin.'
                            })
                        }
                    } else {
                        callback({
                            code: 405,
                            msg: 'Your account is not verified.'
                        })
                    }
                }
            } else {
                callback({
                    code: 405,
                    msg: 'Email or Password is incorrect'
                })
            }
        }
    })


}

function updateUserTokenAndSendResponse(userdata, callback) {
    var provider_token = userdata['data'] != undefined ? userdata['data']['provider_token'] : '' || '';
    var token = {
        user_id: userdata._id,
        token: generatePassword.newToken(),
        provider_token: provider_token || '',
        created_timestamp: new Date().valueOf(),
        updated_timestamp: new Date().valueOf()
    }
    UserTokens.deleteMany({
        user_id: userdata._id,
        provider_token: provider_token
    }).exec(function (err, result) {
        UserTokens.create(token, function (err, token_result) {
            if (token_result != null) {
                ////console.log(userdata);
                var user_response = {
                    _id: userdata._id,
                    email: userdata.email,
                    name: userdata.name,
                    first_name: userdata.first_name,
                    last_name: userdata.last_name,
                    profile_pic: userdata.profile_pic,
                    updated_on: userdata.updated_on,
                    token: token_result.token,
                    role: userdata.role
                };

                callback({
                    code: 200,
                    msg: 'Success',
                    data: user_response
                })

                // FavoriteGenres.find({ user_id: userdata._id }, function (err, doc) {
                //     user_response.favorite_genre = doc;
                //     Users.findById(userdata._id, function(err, uDoc){
                //         if(uDoc){
                //             if(uDoc.last_login == null){
                //                 uDoc.last_login = new Date().valueOf();
                //                 user_response.last_login = uDoc.last_login;
                //                 user_response.last_login_status = true;
                //                 uDoc.save(function(err, resResrult){
                //                     callback({
                //                         code: 200,
                //                         msg: 'Success',
                //                         data: user_response
                //                     })
                //                 });
                //             }
                //             else{
                //                 uDoc.last_login = new Date().valueOf();
                //                 user_response.last_login = uDoc.last_login;
                //                 user_response.last_login_status = false;
                //                 uDoc.save(function(err, resResrult){
                //                     callback({
                //                         code: 200,
                //                         msg: 'Success',
                //                         data: user_response
                //                     })
                //                 });
                //             }
                //         }
                //     })
                // })

            } else {
                callback({
                    code: 405,
                    msg: 'Failed to add get token'
                })
            }
        })
    })
}


function updateProfile(data, callback) {
    callback({
        code: 405,
        msg: 'User not found'
    })
}

function updatePassword(data, callback) {
    callback({
        code: 405,
        msg: 'User not found'
    })

}

function resetPassword(data, callback) {
    Users.find({
        username: data.username,
        is_deleted: false
    }).exec(function (err, result) {
        if (result != null) {
            var password = randomstring.generate(7);
            var hashPassword = generatePassword.createHash(password);
            ////console.log('new hash', hashPassword.hash);
            Users.findOneAndUpdate({
                email: data.username,
                is_deleted: false
            }, {
                    $set: {
                        password: hashPassword.hash
                    }
                }).exec(function (err, result) {
                    if (result != null) {
                        sendMail(data.username, 'Password Changed', 'Password = ' + password, function (result) {
                            if (result != '') {
                                callback({
                                    code: 200,
                                    msg: 'Password is send to your mail id ' + result
                                })
                            } else {
                                callback({
                                    code: 405,
                                    msg: 'Failed to send mail. try again'
                                })
                            }
                        });
                    } else {
                        //console.log(err);
                        callback({
                            code: 405,
                            msg: 'Failed to update user'
                        })
                    }
                })
        } else {
            callback({
                code: 405,
                msg: 'User is not register with us.'
            })
        }
    })
}

function getVerifyLink(data, callback) {
    var tokenString = randomstring.generate(8);
    VerifyTokens.findOne({
        token: tokenString
    }, function (err, result) {
        if (result != null) {
            getVerifyLink(data, callback);
        } else {
            VerifyTokens.create({
                user_id: data._id,
                token: tokenString
            },
                function (err, result) {
                    callback(tokenString);
                }
            )
        }
    })
}

/*
*   Syore user to database
*/
function addUser(data, callback) {
    console.log("Users===============================>", Users);

    console.log("data===============================>", data);
    Users.findOne({
        email: data.email,
        is_deleted: false
    }).lean().exec(function (err, result) {
        if (result == null) {
            var dataPassword = (data.password != undefined) ? data.password.trim() : '' || '';
            var hashPassword = generatePassword.createHash(dataPassword);
            var user = {
                email: data.email,
                name: data.name || '',
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                password: hashPassword.hash,
                // provider_id: data.provider_id,
                provider: data.provider,
                profile_pic: data.profile_pic || '',
                role: 'USER',
                is_confirmed: true,
                is_verified: true,
                created_timestamp: new Date().valueOf(),
                updated_timestamp: new Date().valueOf()
            }

            // if(data.user_img !== undefined){
                console.log("data.user_img===-=1-=-=>", data.profile_pic)
                if(!data.profile_pic.includes('https')){
                    var pic = '/user_profile_img/user_pic_' + (shortid.generate()) + '_' + Date.now() + '.png';
                    const base64Data = data.profile_pic.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                    fs.writeFileSync(appDir + "/assets" + pic, base64Data, 'base64', function (err) {
                    })
                    console.log("pic===-=1-=-=>", pic)
                    user.profile_pic = '/assets' + pic;
                }
                else{
                    user.profile_pic = data.profile_pic;
                }
            // }
            
            Users.create(user, function (err, result) {
                console.log("err----------.>",err);
                if (result != null) {
                    Users.findOne({
                        _id: result._id
                    }).lean().exec(function (err, userdata) {
                        if (userdata != null) {
                            //create user wallet
                            // Userwallets.create({user_id:result._id,total_coins:0,active:true});
                            userdata['data'] = data;
                            updateUserTokenAndSendResponse(userdata, function (response) {
                                callback(response);
                            })
                        } else {
                            callback({
                                code: 405,
                                msg: 'Failed to add user'
                            })
                        }
                    })
                } else {
                    //console.log('Error', err);
                    callback({
                        code: 405,
                        msg: 'Failed to add user! Please check username or password'
                    })
                }
            })
        } else {
            // result.provider='google';
            if (result.provider != '') {
                //console.log(result.provider, data.provider);
                if (result.provider == 'facebook' || result.provider == 'google') {
                    result['data'] = data;
                    updateUserTokenAndSendResponse(result, function (response) {
                        callback(response)
                    })
                } else {
                    callback({
                        code: 405,
                        msg: 'Email is already registered with us1'
                    })
                }
            } else {
                callback({
                    code: 405,
                    msg: 'Email is already registered with us2'
                })
            }
        }
    });
}

/*
 * after social login verify social token and register in app
 *
 */
function updateToken(data, callback) {
    //console.log(data);
    if (data.email != '' && data.provider_id != '' && data.provider != '' && data.name != '' && data.provider_token != '') {
        verifyToken(data, function (result) {
            if (result != null) {
                console.log("=== === ===>", data);
                if (data.provider == 'facebook') {
                    var response = result.data || result;
                    if (response['user_id'] == data.provider_id && response['is_valid']) {
                        addUser(data, function (user) {
                            callback(user);
                        })
                    } else {
                        callback({
                            code: 405,
                            msg: 'User not verified by provider9'
                        });
                    }
                } else if (data.provider == 'google') {
                    var response2 = result;
                    if (response2['email'] == data.email && response2['email_verified']) {
                        addUser(data, function (user) {
                            callback(user);
                        })
                    } else {
                        callback({
                            code: 405,
                            msg: 'User not verified by provider8'
                        });
                    }
                } else {
                    callback({
                        code: 405,
                        msg: 'User not verified by provider7'
                    });
                }
            } else {
                callback({
                    code: 405,
                    msg: 'User not verified by provider6'
                });
            }
        })
    } else {
        var msg = '';
        if (data.email == '') {
            msg = 'Please enter valid email id';
        } else if (data.provider_id == '') {
            msg = 'Please enter valid provider id';
        } else if (data.provider == '') {
            msg = 'Please enter valid provider';
        } else if (data.name == '') {
            msg = 'Please enter valid name';
        } else if (data.provider_token == '') {
            msg = 'Please enter valid provider token';
        }
        callback({
            code: 405,
            msg: msg
        });
    }
}
/*
 * Verify token   
 */
function verifyToken(data, callback) {
    if (data.provider == 'facebook') {
        validateFacebookToken(data, function (result) {
            callback(result);
        })
    } else if (data.provider == 'google') {
        validateGoogleToken(data, function (result) {
            callback(result);
        })
    } else {
        callback({
            code: 405,
            msg: 'Invalid Provider'
        });
    }
}

/*
 * Verify facebook token using facebook graph api  
 */
function validateFacebookToken(data, callback) {
    var access_token_url = `https://graph.facebook.com/v4.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.fb_client_id}&client_secret=${config.fb_client_secret}&grant_type=client_credentials`;
    axios.get(access_token_url)
        .then(function (response) {
            if (response.data) {
                var access_token = response.data.access_token || '';
                axios.get(`https://graph.facebook.com/debug_token?input_token=${data.provider_token}&access_token=${access_token}`)
                    .then(function (response1) {
                        if (response1.data) {
                            //console.log('facebook data');
                            //console.log(response1.data);
                           // console.log(`https://graph.facebook.com/${response1.data.data['user_id']}?input_token=${data.provider_token}&access_token=${access_token}`);
                            axios.get(`https://graph.facebook.com/${response1.data.data['user_id']}?input_token=${data.provider_token}&access_token=${access_token}`)
                            .then(function (user_data) {
                               // console.log(user_data);
                                callback(response1.data); 
                            })
                            .catch(function (error) {
                                callback(response1.data);
                            })
                            
                        } else {
                            callback(null);
                        }
                    })
                    .catch(function (error) {
                        callback(null);
                    })
            } else {
                callback(null);
            }
        })
        .catch(function (error) {
            callback(null);
        })
}

/*
 * Verify google token  
 */
function validateGoogleToken(data, callback) {
    //console.log('google token check')
    var access_token_url = `https://oauth2.googleapis.com/tokeninfo?id_token=${data.provider_token}`;
    axios.get(access_token_url)
        .then(function (response) {
            var google_result = response.data || [];
            //console.log(data);
            var isVerify = google_result.email_verified || false;
            if (isVerify) {
                callback(google_result);
            } else {
                callback(null);
            }
        }).catch(function (error) {
            //console.log(error);
            callback(null);
        })
}

function dashboard(data, callback) {
    var today = new Date();
    var total_live_contest = '';
    var total_genre = '';
    // today.setUTCHours(0,0,0,0);
    // console.log("-=-=-=-today-=-=-=-", today);
    // { $match: {submission_start_date: { $lte : new Date(today.toISOString()) }, submission_last_date: { $gte : new Date(today.toISOString()) }, active: true}},
    async.parallel([
        function (cb) {
            Contests.aggregate([{ $match: { start_date: { $lte: new Date(today.toISOString()) }, end_date: { $gte: new Date(today.toISOString()) }, active: true } },
            { $lookup: { from: "genres", localField: "genre_id", foreignField: "_id", as: "genre" } },
            { $addFields: { category: '$genre.tag_name' } },
            // { $unwind: "$genre" },
            // { $addFields: {category:"$genre.tag_name"}},
            { $sort: { updated_on: -1 } }, { $limit: 10 },
            { $project: { "contest_no": 1, "bg_img": 1, "thumbnail": 1, "title": "$contest_name", "category": 1, "id": "$_id", "_id": 0, "rules": 1, "description": 1,  "submission_start_date": 1, "submission_last_date": 1, "end_date": 1, "start_date": 1  } }
            ]).exec(function (err, result) {
                if (result) {
                    ////console.log("result------1----->", result);
                    var liveData = [];
                    var ilveContest = { "title": "Live Contests", "type": "banner" };
                    async.each(result, function (doc, clb) {
                        if (doc) {
                            doc.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                            liveData.push(doc);
                            clb();
                        }
                    }, function (err) {
                        ilveContest.data = result;
                        cb(null, ilveContest);
                    })
                }
                else {
                    cb(null, { code: 401, msg: 'Data not found' });
                }
            })
        },
        function (cb) {
            var favoriteSong = { "title": "Favorite Genres", "type": "genre" };
            FavoriteGenres.aggregate([{ $match: { user_id: mongoose.Types.ObjectId(data.user_id) } },
            { $lookup: { from: "genres", localField: "genre_id", foreignField: "_id", as: "genre" } },
            { $unwind: "$genre" },
            { $addFields: { title: "$genre.tag_name", bg_img: "$genre.bg_img", id: "$genre._id" } },
            { $project: { "title": 1, "bg_img": 1, "id": 1, "_id": 0 } }
            ]).exec(function (err, genreDocs) {
                //console.log("genreDocs------2----->", genreDocs);
                if (genreDocs) {
                    async.each(genreDocs, function (doc, clb) {
                        doc.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                        clb();
                    }, function (err) {
                        favoriteSong.data = genreDocs;
                        cb(null, favoriteSong);
                    })
                }
                else {
                    cb(null, { code: 401, msg: 'Data not found' });
                }
            })
        },
        function (cb) {
            var UpVottedSong = { "title": "Top Upvoted Songs", "type": "songs" };
            Reviews.aggregate([{ $match: { thump: 'thumbs_up' } },
            { $group: { _id: "$song_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } }, { $limit: 10 }
            ]).exec(function (err, docs) {
                var topUpVotted = [];
                if (docs) {
                    //console.log("docs------3----->", docs);
                    async.eachSeries(docs, function (doc, clb) {
                        if (doc) {
                            var obj = {};
                            Songs.findById(doc._id, function (err, songData) {
                               // console.log("error-songs-------------songs----->",songData, err);
                                if (songData) {
                                    Users.findById(songData.user_id, function (err, artDoc) {
                                        if (artDoc) {
                                            obj.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                                            obj.track_name = songData.song_name;
                                            obj.track_thumbnail = songData.thumbnail;
                                            obj.up_vote = doc.count;
                                            obj.artist_name = artDoc.name;
                                            obj.artist_id = artDoc._id;
                                            obj.track_id = songData._id;
                                            obj.track_path = songData.song_path;
                                            topUpVotted.push(obj);
                                            clb();
                                        }
                                    })
                                }
                                else {
                                    clb();
                                }
                            })
                        }
                    }, function (err) {
                        UpVottedSong.data = topUpVotted;
                        cb(null, UpVottedSong);
                    })
                }
                else {
                    cb(null, { code: 401, msg: 'Data not found' });
                }
            })
        },
        function (cb) {
            var RecentVottedSong = { "title": "Recently Upvoted Songs", "type": "songs" };
            Reviews.aggregate([{ $match: { thump: 'thumbs_up', user_id: mongoose.Types.ObjectId(data.user_id) } },{ $lookup : { from : "reviews", localField : 'song_id',foreignField:'song_id', as: 'total_review'} },
            { $sort: { updated_on: -1 } }, { $limit: 10 }
            ]).exec(function (err, docs) {
                var recentUpVottedArray = [];
                if (docs) {
                    //console.log("docs------4----->", docs);
                    async.eachSeries(docs, function (doc, clb) {
                        if (doc) {
                            var obj = {};
                            Songs.findOne(doc.song_id, function (err, songData) {
                                if (songData) {
                                    obj.up_vote = 0;
                                    if(doc['total_review']){
                                        var total_upvoted =0;
                                        doc['total_review'].forEach(element => {
                                            if(element['thump']=='thumbs_up'){
                                                total_upvoted++;
                                            }
                                        });
                                        obj.up_vote = total_upvoted;
                                    }
                                    Users.findById(songData.user_id, function (err, artDoc) {
                                        if (artDoc) {
                                            obj.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                                            obj.track_name = songData.song_name;
                                            obj.track_thumbnail = songData.thumbnail;
                                            obj.artist_name = artDoc.name;
                                            obj.artist_id = artDoc._id;
                                            obj.track_id = songData._id;
                                            obj.track_path = songData.song_path;
                                            obj.up_vote = total_upvoted;
                                            recentUpVottedArray.push(obj);
                                            clb();
                                        }
                                    })
                                }
                                else {
                                    clb();
                                }
                            })
                        }
                    }, function (err) {
                        RecentVottedSong.data = recentUpVottedArray;
                        cb(null, RecentVottedSong);
                    })
                }
                else {
                    cb(null, { code: 401, msg: 'Data not found' });
                }
            })
        },
        function (cb) {
            console.log('Recently played Songs=>',data.user_id)
            var RecentVottedSong = { "title": "Recently Played Songs", "type": "songs","data" : [] };
            SongPlayedHistory.aggregate([{$match : { user_id : mongoose.Types.ObjectId(data.user_id),active : true}},
                {$lookup: {from: "songs",localField: "song_id",foreignField: "_id",as: "song_detail"}},
                {$unwind: {path: "$song_detail",preserveNullAndEmptyArrays: true}},
                {$lookup: {from: "users",localField: "song_detail.user_id",foreignField: "_id",as: "artist_detail"}},
                {$lookup: {from: "reviews",localField: "song_id",foreignField: "song_id",as: "song_detail.reviews"}},
                {$unwind: {path: "$artist_detail",preserveNullAndEmptyArrays: true}},
                {$group: {  
                         _id: "$song_id",
                         song_id: {
                              $first: "$song_id"
                         },
                        song_detail: {
                              $first: "$song_detail"
                         },
                         artist_detail: {
                              $first: "$artist_detail"
                         },
                         created_on: {
                              $last: "$created_on"
                         },
                    }
                },
                {
                    $sort : { 'created_on' : -1}
                },
                {
                    $limit : 10
                }
            ]).exec(function (err, docs) {
                var recentUpVottedArray = [];
                //console.log('------------recentlysong element -------->',err,docs);
                if (docs) {
                    docs.forEach(song_elem => {
                       // console.log('song element -------->',song_elem);
                        if(song_elem['song_detail']!=undefined){
                            var song = {};
                            song.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                            song.track_name = song_elem['song_detail'].song_name || '';
                            song.track_thumbnail = song_elem['song_detail'].thumbnail || '';
                            song.track_path = song_elem['song_detail'].song_path || '';
                            console.log("song_elem['artist_detail'] =====>",song_elem['artist_detail']);
                            if(song_elem['artist_detail']!=undefined){
                                song.artist_name = song_elem['artist_detail'].name || '';
                                song.artist_id = song_elem['artist_detail']._id || '';
                            }
                            song.track_id = song_elem.song_id;
                            var up_voted_song = 0;
                            var down_voted_song = 0;
                            //console.log("song_elem['song_detail']['reviews']",song_elem['song_detail']['reviews']);
                            if(song_elem['song_detail']['reviews']){
                                song_elem['song_detail']['reviews'].forEach(element => {
                                     if(element['thump'] == 'thumbs_down'){
                                        down_voted_song++;
                                     }
                                     if(element['thump'] == 'thumbs_up'){
                                        up_voted_song++;
                                     }
                                });
                            }
                            song.up_vote = up_voted_song;
                            song.down_vote = down_voted_song;
                            recentUpVottedArray.push(song);
                        }
                        
                    });
                    RecentVottedSong['data'] = recentUpVottedArray;
                    cb(null, RecentVottedSong);
                }
                else {
                    cb(null, { code: 401, msg: 'Data not found' });
                }
            })
        },
        function (cb) {
            var topArtist = { "title": "Top Artists", "type": "artists" };
            ContestWinners.aggregate([
                {
                    $sort: { end_date: -1 }
                }, {
                    $limit: 1
                },
                {
                    $lookup: {
                        from: 'contests',
                        localField: 'contest_id',
                        foreignField: '_id',
                        as: 'contest'
                    }
                },
                { $unwind: '$winners' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'winners.user_id',
                        foreignField: '_id',
                        as: 'winners.user_details'
                    }
                },
                {
                    $group: {
                        _id: "$contest_id",
                        contest: {
                            $first: "$contest"
                        },
                        genre: {
                            $first: "$genre_id"
                        },

                        winners: {
                            $push: "$winners"
                        }
                    }
                }
            ]).exec(function (err, winners_result) {
                var topArtist = {"title": "Top Artists", "type": "artists","data":[]};
                console.log(winners_result);
                var new_winners_arr = [];
                if (winners_result != null && winners_result[0] != undefined) {
                    winners_result[0]['winners'].forEach(element => {
                        var winner = {};
                        winner['artist_id'] = element['user_id'];
                        if (element['user_details'] != undefined && element['user_details'][0] != undefined) {
                            winner['artist_name'] = element['user_details'][0]['name'];
                            winner['email'] = element['user_details'][0]['email'];
                            winner['profile_pic'] = element['user_details'][0]['profile_pic'];
                        } else {
                            winner['artist_name'] = '';
                            winner['email'] = '';
                            winner['profile_pic'] = '';
                        }
                        winner['position'] = element['position'];
                        if(winners_result[0]['contest']!=undefined && winners_result[0]['contest'][0]!=undefined){
                            winner['contest_id'] = winners_result[0]['contest'][0]['_id'] || '';
                            winner['contest_name'] = winners_result[0]['contest'][0]['contest_name'] || '';
                        }
                        new_winners_arr.push(winner);
                    });
                    new_winners_arr = _.orderBy(new_winners_arr, ['position'], ['asc']);
                    topArtist['data'] = new_winners_arr;
                    cb(null, topArtist);
                } else {

                    cb(null, topArtist);
                }
            })
        },
        function (cb) {
            var allGenre = { "title": "All Genres", "type": "genre" };
            Genres.aggregate([{ $match: {active : true} }, { $limit: 10 }, { $project: { "title": "$tag_name", "bg_img": 1, "id": "$_id", "_id": 0 } }]).exec(function (err, genreDocs) {
                if (genreDocs) {
                    //console.log("genreDocs------6----->", genreDocs);
                    async.each(genreDocs, function (doc, clb) {
                        doc.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                        clb();
                    }, function (err) {
                        allGenre.data = genreDocs;
                        cb(null, allGenre);
                    })
                }
                else {
                    cb(null, { code: 401, msg: 'Data not found' });
                }
            })
        }
    ], function (err, results) {
        if (results) {
            //////console.log("results------9----->", results);
            ////console.log("err------10----->", err);
            callback({
                code: 200,
                msg: 'DashBoard received',
                data: results,
                // total_live_contest: total_live_contest,
                // total_genre: total_genre
            })
        }
        else {
            callback({
                code: 500,
                msg: err
            })
        }
    })
}

function artistDetail(data, callback) {
    var mainObj = {};
    async.parallel([
        function (cb) {
            Users.findById(data.user_id, function (err, doc) {
                if (doc) {
                    mainObj.id = doc._id;
                    mainObj.artist_name = doc.name;
                    mainObj.artist_pic = doc.profile_pic;
                    mainObj.fb_link = doc.fb_link;
                    mainObj.insta_link = doc.insta_link;
                    mainObj.twitter_link = doc.twitter_link;
                    mainObj.youtube_link = doc.youtube_link;
                    cb();
                }
                else {
                    callback({
                        code: 200,
                        msg: 'Artist is not exist'
                    })
                }
            })
        },
        function (cb) {
            Songs.aggregate([{ $match: { user_id: mongoose.Types.ObjectId(data.user_id) } }, { $limit: 10 },
                { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user_list" } },
                { $unwind: "$user_list" },
                { $addFields: { artist_name: "$user_list.name" } },
                { $lookup: { from: "contestwinners", localField: "_id", foreignField: "winners.0.song_id", as: "is_winner" } },
                { $project: { "track_name": "$song_name", "track_path": "$song_path", "track_thumbnail": "$thumbnail", "track_id": "$_id", "_id": 0, "artist_name": 1,"is_winner": 1 } },
            ]).exec(function (err, docs) {
                async.each(docs, function (doc, clb) {
                    if(doc.is_winner!=undefined && doc.is_winner[0]!=undefined){
                        doc.is_winner = true;
                    }else{
                        doc.is_winner = false;
                    }
                    async.parallel([
                        function (innercb) {
                            Reviews.count({ song_id: doc.id, thump: 'thumbs_up' }, function (err, docUp) {
                                doc.up_vote = docUp;
                                doc.artist_id = data.user_id;
                                innercb();
                            })
                        },
                        function (innercb) {
                            Reviews.count({ song_id: doc.id, thump: 'thumbs_down' }, function (err, docDown) {
                                doc.down_vote = docDown;
                                doc.artist_id = data.user_id;
                                innercb();
                            })
                        }
                    ], function (err, res) {
                        clb();
                    })

                }, function (err) {
                    mainObj.tracks = docs;
                    cb();
                })

            })
        }
    ], function (err, results) {
        if (results) {
            callback({
                code: 200,
                msg: 'Artist Details received',
                data: mainObj
            })
        }
    })
}


function purchaseCoin(data, callback) {
    Setting.find({ $or: [{ key: "currency_type" }, { key: "per_coin_price" }] }, function (err, doc) {
        if (doc) {
            var currency_type = _.find(doc, { 'key': 'currency_type' }).value;
            var coinPrice = Number(_.find(doc, { 'key': 'per_coin_price' }).value) * Number(data.coins);
            // var coinPrice = doc[0].per_coin_price * Number(data.coins);
            var charge = stripe.charges.create({
                amount: coinPrice * 100,
                currency: currency_type,
                source: data.token
            }, (err, charge) => {
                if (err) {
                    ////console.log("err=-=-=-=-=->", err);
                }
                else {
                    ////console.log("charge=-=-=-=-=->", charge);
                    var UserOrsersModel = new UserOrsers({
                        user_id: data.user_id,
                        Payment_sorce: charge.receipt_url,
                        order_id: charge.id,
                        total_amt: coinPrice,
                        currency: doc[0].currency_type,
                        Payment_status: charge.status
                    }).save(function (err, orderResult) {
                        ////console.log("err-------0----->", err);
                        ////console.log("orderResult-------0----->", orderResult);
                        if (orderResult) {

                            Userwallets.findOne({ user_id: mongoose.Types.ObjectId(data.user_id) }, function (err, userWalletDoc) {
                                ////console.log("userWalletDoc-------1----->", userWalletDoc);
                                if (userWalletDoc) {
                                    userWalletDoc.total_coins = Number(userWalletDoc.total_coins) + Number(data.coins);
                                    userWalletDoc.updated_on = new Date();
                                    userWalletDoc.save(function (err) {
                                        callback({
                                            code: 200,
                                            msg: 'Payment Done Successfully',
                                            data: userWalletDoc
                                        })
                                    })
                                }
                                else {
                                    var UserwalletsModel = new Userwallets({
                                        user_id: data.user_id,
                                        total_coins: data.coins
                                    }).save(function (err, userWallet) {
                                        ////console.log("userWallet-------1----->", userWallet);
                                        if (userWallet) {
                                            callback({
                                                code: 200,
                                                msg: 'Payment Done Successfully',
                                                data: userWallet
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }
    })
}

function userAllData(data, callback) {
    var userData = {}
    async.parallel([
        function (cb) {
            Users.findOne({ _id: mongoose.Types.ObjectId(data.user_id) }, { 'name': 1, 'profile_pic': 1, 'email': 1, 'first_name': 1, 'last_name': 1,'is_user':1, 'contact_email': 1, 'fb_link': 1, 'insta_link':1, 'twitter_link':1, 'youtube_link':1 }).exec(function (err, docs) {
                ////console.log("docs--1--->", docs);
                if (docs) {
                    userData.personal = docs;
                    cb();
                }
            })
        },
        function (cb) {
            Userwallets.findOne({ user_id: mongoose.Types.ObjectId(data.user_id) }, { 'total_coins': 1, 'user_id': 1 }, function (err, docs) {
                ////console.log("docs--2--->", docs);
                if (docs) {
                    userData.wallet = docs;
                    cb();
                }
                else {
                    userData.wallet = { "total_coins": 0 }
                    cb();
                }
            })
        },
        function (cb) {
            var favoriteSong = { "title": "Favorite Genres", "type": "genre" };
            FavoriteGenres.aggregate([{ $match: { user_id: mongoose.Types.ObjectId(data.user_id) } },
            { $lookup: { from: "genres", localField: "genre_id", foreignField: "_id", as: "genre" } },
            { $unwind: "$genre" },
            { $addFields: { title: "$genre.tag_name", bg_img: "$genre.genre", id: "$genre._id" } },
            { $project: { "title": 1, "bg_img": 1, "id": 1, "_id": 0 } }
            ]).exec(function (err, genreDocs) {
                ////console.log("err--1--->", err);
                if (genreDocs) {
                    userData.favoriteGenre = genreDocs;
                    userData.web_link = config.web_url || '';
                    cb();
                }
                else {
                    userData.favoriteGenre = [];
                    userData.web_link = config.web_url || '';
                    cb();
                }
            })
        }
    ], function (err, results) {
        ////console.log("results----->", userData);
        if (results) {
            callback({
                code: 200,
                msg: 'User Details received',
                data: userData
            })
        } else {
            callback({
                code: 405,
                msg: 'Something went wrong'
            })
        }
    })
}


function upCommingContest(data, callback) {
    var today = new Date();
    Contests.aggregate([{ $match: { start_date: { $gte: new Date(today.toISOString()) }, active: true } },
    { $lookup: { from: "genres", localField: "genre_id", foreignField: "_id", as: "genre" } },
    { $addFields: { category: '$genre.tag_name' } },
    { $sort: { updated_on: -1 } }, { $skip: Number(data.skip) }, { $limit: 10 },
    { $project: { "contest_no": 1, "bg_img": 1, "thumbnail": 1, "title": "$contest_name", "category": 1, "id": "$_id", "_id": 0, "rules": 1, "description": 1,  "submission_start_date": 1, "submission_last_date": 1, "end_date": 1, "start_date": 1  } }    
    ]).exec(function (err, result) {
        console.log("result----->", result);
        if (result) {
            var liveData = [];
            var ilveContest = { "title": "Upcomming Contests", "type": "banner" };
            async.each(result, function (doc, clb) {
                if (doc) {
                    doc.bg_color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    liveData.push(doc);
                    clb();
                }
            }, function (err) {
                ilveContest.data = result;
                callback({
                    code: 200,
                    msg: 'Upcomming Contests received',
                    data: ilveContest
                })
                // cb(null, ilveContest);
            })
        }
        else {
            callback({
                code: 401,
                msg: 'Data not found'
            })
            // cb(null, { code: 401, msg: 'Data not found' });
        }
    })
}

function updateUserProfile(data, callback) {
    console.log("data==1===>", data)
    Users.findById(data.user_id, function(err, userDoc){
        if(userDoc){
            if(data.name !== undefined){
                 console.log("data.name===-=-=-=>", data.name)
                userDoc.name = data.name
            }
            if(data.contact_email !== undefined){
                userDoc.contact_email = data.contact_email
            }
            if(data.fb_link !== undefined){
                 console.log("data.fb_link===-=-=-=>", data.fb_link)
                userDoc.fb_link = data.fb_link
            }
            if(data.insta_link !== undefined){
                userDoc.insta_link = data.insta_link
            }
            if(data.twitter_link !== undefined){
                userDoc.twitter_link = data.twitter_link
            }
            if(data.youtube_link !== undefined){
                userDoc.youtube_link = data.youtube_link
            }
            if(data.user_img !== undefined){
                console.log("data.user_img===-=1-=-=>", data.user_img)
                if(data.user_img === 'undefined'){
                }
                else{
                    var pic = '/user_profile_img/user_pic_' + (shortid.generate()) + '_' + Date.now() + '.png';
                    const base64Data = data.user_img.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                    fs.writeFileSync(appDir + "/assets" + pic, base64Data, 'base64', function (err) {
                    })
                    userDoc.profile_pic = data.base_url + '/assets' + pic;
                }
            }
            userDoc.save(function(err, result){
                console.log("err===2==>", err)
                if(result){
                    callback({
                        code: 200,
                        msg: 'User Profile Save',
                        data: result
                    })
                }
            })
        }
    })
}

// function getAllUsers(data, callback){
//     Users.find({}).exec(function (err, result) {
//         if (result != null) {
//             callback({
//                 code: 200,
//                 msg: 'get all User successfully',
//                 data: result
//             })
//         } 
//         else {
//             callback({
//                 code: 400,
//                 msg: 'get all User successfully'
//             })            
//         }
//     })        
// }

function getAllUsers1(data, callback){
    var senderId = data.userId;
    console.log("data.userId---------======.", data.user_id);
    Messages.aggregate([
        {$match: { sender_id:  mongoose.Types.ObjectId(data.user_id)}},
            {$group : { _id : "$receiver_id",
                created_timestamp: {
                    $last: "$$ROOT"
                },
                sender_id: {
                    $first: "$sender_id"
                },
            }
        }
    ]).exec(function (err, resultSend) {
        if(!err){
            Messages.aggregate([
                {$match: { receiver_id:  mongoose.Types.ObjectId(data.user_id)}},
                    {$group : { _id : "$sender_id",
                        created_timestamp: {
                            $last: "$$ROOT"
                        },
                        receiver_id: {
                            $first: "$receiver_id"
                        },
                    }
                }
            ]).exec(function (error, resultRec) {    
                if(!error){
                    var pepleCom = resultSend;
                    async.eachSeries(pepleCom, function(docSend, cb){
                        async.eachSeries(resultRec, function(docRec, innercb){
                            console.log(docSend['_id'],"<-----send---1-->", docRec['_id'])
                            if(docSend['_id'] == docRec['_id']){
                                console.log(docSend['_id'],"<-----send---2-->", docRec['_id'])
                                if(docRec['created_timestamp'] > docSend['created_timestamp']){
                                    console.log(docSend['_id'],"<-----send---3-->", docRec['_id'])
                                    // pepleCom.splice(_.indexOf(pepleCom, _.findWhere(pepleCom, { _id : docSend['_id']})), 1);
                                    pepleCom.push(docRec)
                                }
                            }
                            innercb()
                        }, function(err){
                            console.log("pepleCom---l-->", pepleCom)
                            cb()    
                        })                        
                    })
                }
            })        
        }
        // if (result != null) {
        //     callback({
        //         code: 200,
        //         msg: 'get all User successfully',
        //         data: result
        //     })
        // } 
        // else {
        //     callback({
        //         code: 400,
        //         msg: 'get all User successfully'
        //     })            
        // }
    })        
}


// db.getCollection('messages').aggregate([
//     {$match: 
//         { $or: [
//                 {receiver_id: ObjectId("5ec514710e179034749470b3")},
//                 {sender_id: ObjectId("5ec514710e179034749470b3")}
//             ]
//         }
//     },
//     {$group : { _id : {"sender_id":"$sender_id","receiver_id":"$receiver_id"},
//             created_timestamp: {
//                 $last: "$$ROOT"
//             },
//             receiver_id: {
//                 $first: "$receiver_id"
//             },
//         }
//     }
// ])


function getAllUsers(data, callback){
    Messages.aggregate([
        {$match: 
            { $or: [
                    {receiver_id: mongoose.Types.ObjectId(data.user_id)},
                    {sender_id: mongoose.Types.ObjectId(data.user_id)}
                ]
            }
        },
        {$group : { _id : {"sender_id":"$sender_id","receiver_id":"$receiver_id"},
                msgdata: {
                    $last: "$$ROOT"
                },
                created_timestamp: {
                    $last: "$created_timestamp"
                },                
                sender_id: {
                    $last: "$sender_id"
                },
                receiver_id: {
                    $last: "$receiver_id"
                },                
                message: {
                    $last: "$message"
                },
            }
        },
        { "$project" : { 
            "message": "$msgdata.message", 
            "created_timestamp": "$msgdata.created_timestamp",
            "receiver_id": "$msgdata.receiver_id",
            "sender_id": "$msgdata.sender_id",
            "_id": 0
         }
        },
        {$sort: {created_timestamp: -1}}
    ]).exec(function (err, result) {
        if (result != null) {
            var datas = result;
            var array = [];
            async.eachSeries(datas, function(data1, cb){
                if(data.user_id == data1.receiver_id){
                    array.push({client: data1.sender_id, msg: data1.message, time: data1.created_timestamp});
                    cb();
                }
                else{
                    array.push({client: data1.receiver_id, msg: data1.message, time: data1.created_timestamp});
                    cb();                   
                }
            }, function(err){
                // console.log("array----------------->", array);
                hash = Object.create(null),
                unique = array.reduce(function (r, o) {
                    if (!(o.client in hash)) {
                        hash[o.client] = r.push(o) - 1;
                        return r;
                    }
                    if (o.time > r[hash[o.client]].time) {
                        r[hash[o.client]] = o;
                    }
                    return r;
                }, []);
                
                var resultArray = []
                async.eachSeries(unique, function(uni, cb2){
                    Users.findById(mongoose.Types.ObjectId(uni.client), function(err, doc){
                        if(doc){
                            console.log("doc----------1------->", doc);
                            resultArray.push({_id: doc._id, name: doc.name, profile_pic: doc.profile_pic, is_live: doc.is_live, last_msg_time: uni.time, msg: uni.msg})
                            cb2();
                        }
                        else{
                            cb2();
                        }
                    })
                }, function(err){
                    callback({
                        code: 200,
                        msg: 'get all User successfully',
                        data: resultArray.sort((a, b) => parseFloat(b.last_msg_time) - parseFloat(a.last_msg_time))
                    }) 
                })               
            })
        } 
        else {
            callback({
                code: 400,
                msg: 'get all User successfully'
            })            
        }
    })        
}


function search_user(data, callback){
    console.log("data---------->", data);
    
    Users.aggregate([
        { $match: {$or: [
            { email: { $regex: data.key }}, 
            { name: { $regex: data.key }},
            // { first_name: { $regex: data.key }},
            // { last_name: { $regex: data.key }},
        ], is_deleted: false}},
        { $project: { "name":1, "email":1, "first_name":1, "last_name":1, "profile_pic": 1, "is_live": 1, "is_user":1}}
    ]).exec(function (err, result) {
        if (result != null) {
            callback({
                code: 200,
                msg: 'get all search User successfully',
                data: result
            })
        } 
        else {
            callback({
                code: 400,
                msg: 'get all search User successfully'
            })            
        }
    })        
}

function thisUserOnline(data, callback){
    console.log("-<thisUserOnline data>-", data);
    if(data){
    Users.findById(data.id,function(err, doc){
        doc.is_live = data.is_live || false;
        doc.save(function(err){
                if(!err){
                    callback({
                        code: 200,
                        msg: 'user online Successfully',
                        data: {_id: doc._id, is_live: doc.is_live}
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
    })
    }
    else{
        console.log("err->", err);
        callback({
            code: 400,
            msg: 'Somthing went wrong.'
        }) 
    }
}