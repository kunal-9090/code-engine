const express = require("express");

const router = express.Router();

const db = require("./db");

const authMiddleware = require("./middleware");


/* =========================

CREATE PROBLEM

========================= */

router.post("/", authMiddleware, async (req, res) => {

try {

const { title, description, difficulty } = req.body;

const [result] = await db.execute(

`INSERT INTO problems
(title, description, difficulty)
VALUES (?, ?, ?)`,
[
title,
description,
difficulty
]

);

res.json({

success:true,
problemId: result.insertId

});

}
catch(err){

res.json({

success:false,
error:String(err)

});

}

});


/* =========================

GET ALL PROBLEMS

========================= */

router.get("/", async (req,res)=>{

const [rows] =
await db.execute(
"SELECT * FROM problems"
);

res.json(rows);

});


/* =========================

GET SINGLE PROBLEM

========================= */

router.get("/:id", async (req,res)=>{

const [rows] =
await db.execute(

"SELECT * FROM problems WHERE id=?",

[req.params.id]

);

res.json(rows[0]);

});


module.exports = router;