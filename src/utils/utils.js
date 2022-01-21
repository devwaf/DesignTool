export function getUUId(){
    let date = new Date()
    let time = Math.floor(date.getTime() * Math.random() * 1000) + 1
    let tem = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    let i = 0
    let char = ""
    let uuid = ""
    for(i;i<tem.length;i++){
        if(tem[i] === "x"){
            char = Math.ceil(Math.random() * 16).toString(16)
        }else{
            char = tem[i]
        }
        uuid+=char
    }
    return uuid
}