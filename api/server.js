const express = require("express");
const fs = require("fs");
const path = require("path");

const { runCode } = require("../runner/run");
const { judge } = require("../runner/judge");
const { createSubmission } = require("../runner/submission");
const app = express();

app.use(express.json());



/* =====================================
EXECUTE API
===================================== */

app.post("/execute", async (req, res) => {

try {

const { language, code, input } = req.body;

const tempDir = path.join(__dirname, "../temp");

if (!fs.existsSync(tempDir)) {

fs.mkdirSync(tempDir, { recursive: true });

}


let filename = "";

if (language === "cpp") filename = "main.cpp";
else if (language === "c") filename = "main.c";
else if (language === "java") filename = "Main.java";
else filename = "main.py";


const filePath = path.join(tempDir, filename);

fs.writeFileSync(filePath, code);


const result = await runCode(language, tempDir, input);


res.json(result);


}
catch (err) {

res.json({
success:false,
error:String(err)
})

}

});



/* =====================================
SUBMIT API
===================================== */

app.post("/submit", async (req, res) => {

try {

const { language, code, problemId } = req.body;

const result = await judge(language, code, problemId);

res.json({

success:true,
results: result

});

}
catch (err) {

res.json({

success:false,
error:String(err)

})

}

});



/* =====================================
START SERVER
===================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(`🔥 Code Engine Running on port ${PORT}`);

});