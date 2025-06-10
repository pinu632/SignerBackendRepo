// server/helpers/apiResponse.js

export const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, error = "Something went wrong", statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message: typeof error === 'string' ? error : error.message,
  });
};
