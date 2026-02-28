const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret";

function authMiddleware(req, res, next) {

try {

const authHeader =
req.headers.authorization;

if (!authHeader)
return res.json({
success:false,
message:"Token missing"
});

const token =
authHeader.split(" ")[1];

const decoded =
jwt.verify(token, JWT_SECRET);

req.user = decoded;

next();

}
catch(err){

res.json({
success:false,
message:"Invalid token"
});

}

}

module.exports = authMiddleware;