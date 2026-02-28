const { exec } = require("child_process");

function runCode(language, tempDir, input = "") {

return new Promise((resolve) => {

let command = "";


// ================= PYTHON =================

if (language === "python") {

command =
`docker run --rm -i -v "${tempDir}:/app" codeengine-python python main.py`;

}


// ================= CPP =================

else if (language === "cpp") {

command =
`docker run --rm -i -v "${tempDir}:/app" codeengine-cpp sh -c "g++ main.cpp -o main && ./main"`;

}


// ================= C =================

else if (language === "c") {

command =
`docker run --rm -i -v "${tempDir}:/app" codeengine-c sh -c "gcc main.c -o main && ./main"`;

}


// ================= JAVA =================

else if (language === "java") {

command =
`docker run --rm -i -v "${tempDir}:/app" codeengine-java sh -c "javac Main.java && java Main"`;

}


// ================= INVALID =================

else {

resolve({

success:false,
type:"Unsupported Language",
error:"Language not supported"

});

return;

}


// ================= EXECUTION =================

const process = exec(command,

(error, stdout, stderr) => {


// COMPILE ERROR

if (error) {

resolve({

success:false,
type:"Compile Error",
error:stderr || error.message

});

return;

}


// RUNTIME ERROR

if (stderr) {

resolve({

success:false,
type:"Runtime Error",
error:stderr

});

return;

}


// SUCCESS

resolve({

success:true,
output:stdout.trim()

});

});


process.stdin.write(input);

process.stdin.end();


});

}

module.exports = { runCode };