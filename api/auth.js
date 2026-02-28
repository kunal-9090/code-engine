const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./db");

const router = express.Router();

const JWT_SECRET = "supersecret";



/* ==============================
REGISTER
============================== */

router.post("/register", async (req, res) => {

try {

const { username, email, password } = req.body;

const hashed =
await bcrypt.hash(password, 10);

const [result] =
await db.execute(

`INSERT INTO users
(username, email, password)
VALUES (?, ?, ?)`,

[
username,
email,
hashed
]

);

res.json({

success: true,
userId: result.insertId

});

}
catch (err) {

res.json({

success: false,
error: String(err)

});

}

});



/* ==============================
LOGIN
============================== */

router.post("/login", async (req, res) => {

try {

const { email, password } = req.body;

const [users] =
await db.execute(

"SELECT * FROM users WHERE email=?",

[email]

);

if (users.length === 0)
return res.json({

success: false,
message: "User not found"

});


const user = users[0];

const match =
await bcrypt.compare(
password,
user.password
);

if (!match)
return res.json({

success: false,
message: "Invalid password"

});


const token =
jwt.sign(

{
id: user.id,
email: user.email
},

JWT_SECRET,

{
expiresIn: "7d"
}

);


res.json({

success: true,
token

});

}
catch (err) {

res.json({

success: false,
error: String(err)

});

}

});


module.exports = router;