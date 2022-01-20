export function getUUId(){
    let date = new Date()
    let time = Math.floor(date.getTime() * Math.random() * 1000) + 1
    return time.toString(16)
}