const path = require("path")
const exec = require("child_process").exec
const iconv = require("iconv-lite");

export function execPython(params) {
    
    let str = params ? "api.py " + params : "api.py"

   exec(path.join(__dirname,str),function(error,stdout,stderr){
       if(error){
           console.log(`exec error: ${error}`)
           return
       }
        console.log("exec success!!!")
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
   })
//    console.log(result);
}