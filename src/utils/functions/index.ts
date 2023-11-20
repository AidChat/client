export function formatTime(date: string){
     return new Date(date).toTimeString().slice(0,8)
}


export function validateEmail(email:string) {
     // Regular expression for a basic email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     // Test the email against the regex
     return emailRegex.test(email);
}


export function formatTimeToHHMM(date:any) {
     const d = new Date(date);
          const hours = d.getHours();
          const minutes = d.getMinutes();
          const amOrPm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; // Convert hours to 12-hour format

          const formattedTime = `${formattedHours}:${String(minutes).padStart(2, '0')} ${amOrPm}`;
          return formattedTime;

}

export function formatDateToDDMMYYYY(date:any) {
     const d = new Date(date);
     const day = String(d.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
     const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month (+1 because months are zero-indexed) and pad with leading zero if needed
     const year = d.getFullYear(); // Get full year
     const d1 = new Date();
     const day1 = String(d1.getDate()).padStart(2, '0');
     const month1 = String(d1.getMonth() + 1).padStart(2, '0');
     const year1 = d1.getFullYear();
     if( (day+month+year) === (day1+month1+year1)){
          return 'Today'
     }else{
          return `${day}/${month}/${year}`;
     }

}