
// Function to generate password
export const generatePassword = (number) => {
     // Declare a string variable 
    // which stores all string
    var string = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    let passwordGen = '';
      
    // Find the length of string
    var len = string.length;
    for (let i = 0; i < number; i++ ) {
        passwordGen += string[Math.floor(Math.random() * len)];
    }
    return passwordGen;
}