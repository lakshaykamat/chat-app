const { HttpStatusCode } = require("../lib")

function errorHandler(
  err,
  req,
  res,
  next
) {
  const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: true,
    message: message,
  });
}

module.exports=errorHandler;