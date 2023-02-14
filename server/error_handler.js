module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    // console.log('----------------Error Handler-------------------', req.body);
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ code : 500, msg: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({code : 500, msg: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ code : 500,msg: err.message });
}
