const fs = require("fs");
const path = require("path");
const { judge } = require("./judge");

async function createSubmission(language, code, problemId, userId="guest") {


// ================= CREATE ID =================

const submissionId=
Date.now().toString();


// ================= CREATE DIR =================

const submissionDir=
path.join(
__dirname,
"../submissions",
submissionId
);

fs.mkdirSync(
submissionDir,
{recursive:true}
);


// ================= FILE NAME =================

let filename="";

switch(language){

case "cpp":
filename="main.cpp";
break;

case "c":
filename="main.c";
break;

case "java":
filename="Main.java";
break;

case "python":
filename="main.py";
break;

default:

return{

success:false,
error:"Unsupported Language"

};

}


// ================= SAVE CODE =================

fs.writeFileSync(

path.join(submissionDir,filename),
code

);


// ================= SAVE META =================

const metadata={

submissionId,
userId,
problemId,
language,
createdAt:new Date()

};


fs.writeFileSync(

path.join(submissionDir,"meta.json"),
JSON.stringify(metadata,null,2)

);


// ================= RUN JUDGE =================

const result=
await judge(
language,
code,
problemId
);


// ================= SAVE RESULT =================

fs.writeFileSync(

path.join(submissionDir,"result.json"),
JSON.stringify(result,null,2)

);


// ================= RETURN =================

return{

success:true,
submissionId,
result

};

}

module.exports={createSubmission};