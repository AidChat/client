export function formatTime(date: string){
     return new Date(date).toTimeString().slice(0,8)
}


export function validateEmail(email:string) {
     // Regular expression for a basic email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     // Test the email against the regex
     return emailRegex.test(email);
}