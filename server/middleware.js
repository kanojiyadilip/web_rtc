var Users = require('./users/users.model');

function middleware(req, res, next) {
    console.log('----------------Middleware-------------------');
    if (typeof req.body.user_id == 'undefined') {
        var obj ={ "code": 400, "msg": "user_id is not provided"}
        res.status(200).json(obj);
    }
    else{
        Users.findById(req.body.user_id, function(err, doc){
            if(doc){
                next();
            }
            else{
                return res.status(401).json({code : 400, msg: 'User Not Found' });
            }
        })
    }
}

module.exports = middleware;