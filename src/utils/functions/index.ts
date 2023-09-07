export function formatTime(date:Date){
     return new Date(date).toTimeString().slice(0,8)
}