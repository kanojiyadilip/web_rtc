// const express = require('express');
// const path = require('path');

// const app = express();

// Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist'));

// app.get('/*', function(req,res) {
    
// res.sendFile(path.join(__dirname+'/dist/index.html'));
// });

// Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);















require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
// var data = require('./server/config.json')
var mongoose = require('mongoose');
var path = require('path');
var config = require('./server/config.json');
var errorHandler = require('./server/error_handler');
global.appDir =  path.resolve(__dirname);
var URL = "mongodb+srv://deepak:deepak123@cluster0-hqirx.mongodb.net/test?retryWrites=true&w=majority"
var green = "\x1b[32m";
var red = "\x1b[31m"
var reset = "\x1b[0m";
mongoose.connect(process.env.MONGODB_URI || URL,{ useUnifiedTopology: true, useNewUrlParser: true}).then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
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
app.use('/api/users', require('./server/users/users.controller'));
app.use('/api/msg', require('./server/messages/message.controller'));
app.use('/api/basic', require('./server/basic/basic.controller'));

app.use(express.static(path.join(__dirname, './server')));


app.use(express.static(path.join(__dirname, '/dist')));
app.use('/',express.static(path.join(__dirname, '/dist')));

app.get('**', function(req,res) {
    
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});


app.use(errorHandler);
var server = app.listen(process.env.PORT || config.port,() => {
  console.log(`HTTP Server http://localhost:${process.env.PORT || config.port}`);
});

const io = require('socket.io')(server);
// Handle connection
io.on('connection', function (socket) {
  console.log("Connected succesfully to the socket ...");
  app.set('socketio', io);

  socket.on('join', function (data) {
    socket.join(data.receiver_id);
  })
  socket.on('sendMessage', function (data) {
    // socket.emit('mybroadcast', data);
    

    messageSave.sendMessages(data, function(result){
      if(result.code = 200){
      console.log("socket.id============>", socket.id)
      socket.broadcast.emit('broadcastMsg', data);
        // io.sockets.in('user1@example.com').emit('new_msg', {msg: 'hello'});
        return true;
      }else{
          console.error(red,result.msg,reset);
          process.exit();
      }
    })

    console.log("=-=-=-=-=-data-=-=-=-=-=->", data);
  })

  socket.broadcast.on('typing', data => {
    console.log("=-=-=-=-=-typing-=-=-=-=-=->", data);
    socket.broadcast.emit('typing', data);
  });

  socket.broadcast.on('calling', data => {
    console.log("=-=-=-=-=-calling-=-2=-=-=-=->", data);
    socket.broadcast.emit('calling', data);
  });
})


//add admin user first
var Users = require('./server/users/users.model');
var UserService = require('./server/users/users.service');
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

var messageSave = require('./server/messages/message.service');