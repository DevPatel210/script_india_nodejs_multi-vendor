/* eslint-disable no-unused-vars */
const messages = module.exports = {};
messages.successResponse = (headers, statusCode, data, meta = {}) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message: 'Your request is successfully executed',
    data,
    meta,
  },
});
messages.failureResponse = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: 'Internal Server Error',
    data: {},
  },
});
messages.badRequest = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: 'The request cannot be fulfilled due to bad syntax',
    data: {},
  },
});

messages.isDuplicate = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'VALIDATION_ERROR',
    message: 'Data duplication Found',
    data: {},
  },
});

messages.isAssociated = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'CONFLICT',
    message: 'Authentication data are already associated with another account.',
    data: {},
  },
});

messages.recordNotFound = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'RECORD_NOT_FOUND',
    message: 'Record not found with that criteria.',
    data: {},
  },
});
messages.insufficientParameters = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: 'Insufficient parameters',
    data: {},
  },
});

messages.mongoError = (headers, statusCode, error) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: 'Mongo db related error',
    data: {},
  },
});
messages.inValidParam = (headers, statusCode, error) => ({
  headers,
  statusCode,
  data: {
    status: 'VALIDATION_ERROR',
    message: error,
    data: {},
  },
});

messages.unAuthorizedRequest = (headers, statusCode, error) => ({
  headers,
  statusCode,
  data: {
    status: 'UNAUTHORIZED',
    message: 'You are not authorized to access the request',
    data: {},
  },
});

messages.loginSuccess = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message: 'Login Successful',
    data,
  },
});
messages.passwordEmailWrong = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: 'Incorrect mobile phone number or password',
    data: {},
  },
});
messages.adminPasswordEmailWrong = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: 'Incorrect mobile phone number or password',
    data: {},
  },
});
messages.loginFailed = (headers, statusCode, error) => ({
  headers,
  statusCode,
  data: {
    status: 'BAD_REQUEST',
    message: `Login Failed, ${error}`,
    data: {},
  },
});
messages.failedSoftDelete = (headers, statusCode) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: 'Data can not be soft deleted due to internal server error',
    data: {},
  },
});
messages.invalidRequest = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: data,
    data: {},
  },
});

messages.invalidRequestWithData = (headers, statusCode, message, data) => ({
  headers,
  statusCode,
  data: {
    status: 'FAILURE',
    message: message,
    data: data,
  },
});
messages.requestValidated = (headers, statusCode, data) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message: data,
    data: {},
  },
});
messages.requestValidatedWithData = (headers, statusCode, message, data, meta = {}) => ({
  headers,
  statusCode,
  data: {
    status: 'SUCCESS',
    message,
    data,
    meta,
  },
});
