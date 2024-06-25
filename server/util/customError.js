class CustomError extends Error {
    constructor(statusCode = 500, message = "Internal Server Error") {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = CustomError;
  