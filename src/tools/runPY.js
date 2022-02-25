const path = require("path")
const spawn = require("child_process").spawn
const iconv = require("iconv-lite");

export function execPython(params) {
    
    // let str = params ? "api.py " + params : "api.py"
    // console.log("string type " + typeof str);
    console.log("node spawn python start");
    console.log("node spawn " + params);
    let filePath = path.join(__dirname,"./api.py")
    let py =  spawn("python",[filePath,params])
    py.stdout.on("data",(data)=>{
        console.log("exec success!!!")
        console.log(`stdout: ${iconv.decode(data,'cp936')}`);
        py.kill()
    })
    

    py.stderr.on("data",err=>{
        console.log(`spawn error: ${err}`)
        py.kill()
    })

    py.on("error",(err)=>{
        console.log(`spawn error: ${err}`)
        py.kill()
    })
    // spawn(path.join(__dirname,str),function(error,stdout,stderr){
    //     if(error){
    //         console.log(`exec error: ${error}`)
    //         return
    //     }
    //         console.log("exec success!!!")
    //         console.log(`stdout: ${stdout}`);
    //         console.log(`stderr: ${stderr}`);
    // })
//    console.log(result);
}

// let data = {"number":[{"label":"Number","name":"数值","uuid":"b9a48361-b2b7-847a-85b8-4f1045b283b1e","value":10},{"label":"Parameter","name":"参数","uuid":"94645210e-9697-fa61-410e4-464eb5262a2e","value":10},{"label":"Add","name":"add","uuid":"f377d4107-f1c3-98710-f3ce-c38fc510e9f7e","value":["b9a48361-b2b7-847a-85b8-4f1045b283b1e","94645210e-9697-fa61-410e4-464eb5262a2e"]}],"geometry":[]}
// execPython(JSON.stringify(data))