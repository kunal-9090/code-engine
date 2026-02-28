const fs = require("fs");
const path = require("path");
const { runCode } = require("./run");

async function judge(language, code, problemId) {

try {

const problemPath =
path.join(__dirname,"../problems",problemId.toString());

const tempDir =
path.join(__dirname,"../temp");

if (!fs.existsSync(tempDir))
fs.mkdirSync(tempDir,{recursive:true});


// ================= SAVE CODE =================

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


fs.writeFileSync(
path.join(tempDir,filename),
code
);


// ================= READ TESTCASES =================

const testcases=
fs.readdirSync(problemPath);


let results=[];


// ================= RUN EACH TESTCASE =================

for(const tc of testcases){

const input=
fs.readFileSync(
path.join(problemPath,tc,"input.txt"),
"utf8"
);


const expected=
fs.readFileSync(
path.join(problemPath,tc,"output.txt"),
"utf8"
).trim();


const execution=
await runCode(language,tempDir,input);


// ERROR

if(!execution.success){

results.push({

testcase:tc,
status:execution.type,
error:execution.error

});

continue;

}


// CHECK ANSWER

if(execution.output===expected){

results.push({

testcase:tc,
status:"Accepted"

});

}

else{

results.push({

testcase:tc,
status:"Wrong Answer",
expected,
output:execution.output

});

}

}


// ================= FINAL =================

return{

success:true,
results

};


}
catch(err){

return{

success:false,
error:String(err)

};

}

}

module.exports={judge};