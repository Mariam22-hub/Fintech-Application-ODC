const validator = require('validator');

function validateEmailAndPasswordFormat(email, password) {
  // Validate email format
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  // Validate password format
  if (!validator.isStrongPassword(password)) {
    return { isValid: false, message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol' };
  }

  // Return success message if both email and password formats are valid
  return { isValid: true, message: 'Email and password formats are valid' };
}

module.exports = {
  validateEmailAndPasswordFormat,
}