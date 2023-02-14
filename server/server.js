require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

var mongoose = require('mongoose');
var path = require('path');
var config = require('./config.json');
var errorHandler = require('./error_handler');
global.appDir =  path.resolve(__dirname);
var URL="mongodb://localhost/"+config.dbname;
// var URL = "mongodb+srv://deepak:deepak123@cluster0-hqirx.mongodb.net/test?retryWrites=true&w=majority"
var green = "\x1b[32m";
var red = "\x1b[31m"
var reset = "\x1b[0m";
mongoose.connect(URL, function(err) {
  if(err){
    console.log("----0000--->",err);
  }
});
//change color of console and then reset
console.log(green,"Connected to "+config.dbname+" Database");
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// api routes
app.use('/api/users', require('./users/users.controller'));
app.use('/api/msg', require('./messages/message.controller'));
app.use('/api/basic', require('./basic/basic.controller'));

app.use(express.static(path.join(__dirname)));

app.use(express.static(path.join(__dirname, '/../dist')));
app.use('/',express.static(path.join(__dirname, '/../dist')));

app.get('**', function(req,res) {
    
  res.sendFile(path.join(__dirname+'/../dist/index.html'));
});




//get all assets
// app.use(express.static(path.join(__dirname)));
// global error handler
app.use(errorHandler);
// app.use('/',function(res,res){
//     res.send('Welcome to wyre api');
// });
// var io = require('socket.io').listen(app);
var server = app.listen(config.port,() => {
  console.log(`HTTP Server http://localhost:${config.port}`);
});

var users = []
const io = require('socket.io')(server, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});

io.origins('*:*');

// Handle connection
io.on('connection', function (socket) {
  // io.to(socket.id).emit('private', '----------Just for you bud----'+socket.id+'--------');
  console.log("Connected succesfully to the socket ...");
  app.set('socketio', io);

  socket.on('join', function (user_id) {
    console.log("join===============join==================>", user_id);
    socket.join(user_id);
    users[user_id] = socket.id; 
    io.emit("user_connected",user_id);
  })

  socket.on('sendMessage', function (data) {
    // socket.emit('mybroadcast', data);
    

    messageSave.sendMessages(data, function(result){
      if(result.code = 200){
      console.log("result============>", result);
      // console.log("data============>", data);
      // socket.broadcast => io
      // socket.broadcast.emit('broadcastMsg', {_id: result['data']['_id'], sender_id: result['data']['sender_id'].toString(), receiver_id: result['data']['receiver_id'].toString(), message: result['data']['message'], created_timestamp: result['data']['created_timestamp']});
      // io.to(socket.id).emit('self', {_id: result['data']['_id'], sender_id: result['data']['sender_id'].toString(), receiver_id: result['data']['receiver_id'].toString(), message: result['data']['message'], created_timestamp: result['data']['created_timestamp']});
      // io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});
        // io.to(socket.id).emit('private', '----------Just for you bud------------');
        console.log("users-------------------------------------->",users);
        var socketId = users[result['data']['receiver_id'].toString()];
        console.log("receiver_id-------------------------------------->",result['data']['receiver_id'].toString());
        console.log("socketId-------------------------------------->",socketId);
        io.to(socketId).emit('broadcastMsg', {_id: result['data']['_id'], sender_id: result['data']['sender_id'].toString(), receiver_id: result['data']['receiver_id'].toString(), message: result['data']['message'], created_timestamp: result['data']['created_timestamp']});
        
        // ======= for self reciving sms ===================
        var socketId = users[result['data']['sender_id'].toString()];
        io.to(socketId).emit('self', {_id: result['data']['_id'], sender_id: result['data']['sender_id'].toString(), receiver_id: result['data']['receiver_id'].toString(), message: result['data']['message'], created_timestamp: result['data']['created_timestamp']});
        return true;
      }else{
          console.error(red,result.msg,reset);
          process.exit();
      }
    })

    // console.log("=-=-=-=-=-data-=-=-=-=-=->", data);
  })

  socket.broadcast.on('typing', data => {
    console.log("=-=-=-=-=-typing-=-=-=-=-=->", data);
    socket.broadcast.emit('typing', data);
  });

  socket.broadcast.on('calling', data => {
    console.log("=-=-=-=-=-calling-=-=-1=-=-=->", data);
    socket.broadcast.emit('calling', data);
  });

  socket.on('vcall', data => {
    console.log("=-=-=-=-=-vcall-=-=-=-=-=->", data);
    var socketIdVcall = users[data['receiver_id'].toString()];
    io.to(socketIdVcall).emit('vCallAttempt', {sender_id: data['sender_id'].toString(), receiver_id: data['receiver_id'].toString(), vCallData: data['vCallData'], name: data['name']});
  }); 

  socket.broadcast.on('thisUserOnline', data => {
    console.log("=-=-=-=-=-thisUserOnline-=-=-=-1=-=->", data);
    UserService.thisUserOnline(data, function(result){
      console.log("=-=-=-=-=-thisUserOnline-=-=-=-2=-=->", result);
      if(result.code = 200){
        socket.broadcast.emit('thisUserOnlineUpdate', result);
      }
      else{

      }
    })
  });
})


//add admin user first
var Users = require('./users/users.model');
var UserService = require('./users/users.service');
var admin = {
    username : 'dkanojiya@gmail.com',
    email : 'dkanojiya@gmail.com',
    password : 'dkanojiya'
}
UserService.addAdmin(admin,function(result){
    if(result.code = 200){
        console.log(green,result.msg,reset);
        console.log('username :',green,' dkanojiya@gmail.com',reset,'password :',green,' dkanojiya',reset);
    }else{
        console.error(red,result.msg,reset);
        process.exit();
    }
});

var messageSave = require('./messages/message.service');






