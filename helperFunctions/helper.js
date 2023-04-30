const generateCreditCardNumber = () => {
    // Generate 15 random digits
    let digits = '';
    for (let i = 0; i < 15; i++) {
      digits += Math.floor(Math.random() * 10);
    }
  
    // Calculate checksum using Luhn algorithm
    let sum = 0;
    for (let i = 0; i < 15; i++) {
      let digit = parseInt(digits[i]);
      if ((i + 1) % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }
    let checksum = (10 - (sum % 10)) % 10;
  
    // Return complete credit card number
    return digits + checksum;
  }

  module.export  = {generateCreditCardNumber};