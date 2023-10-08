export function formatTime(date: string){
     return new Date(date).toTimeString().slice(0,8)
}