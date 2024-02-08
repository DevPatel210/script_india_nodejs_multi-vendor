function sendResponse(response, result) {
  return response
    .set(
      result.data.headers ? result.data.headers : { "Content-Type": "application/json" }
    )
    .status(result.statusCode)
    .send(result.data);
}

function response(err, displayMsg, techMsg, data = [],statusCode=200) {
  if (err) {
    displayMsg = displayMsg || "Something Went Wrong";
    return {statusCode,data:{ isSuccess: false, displayMsg, techMsg, data }};
  }
  return {statusCode, data:{ isSuccess: true, displayMsg, techMsg, data }};
}

function handleResponse(promise, res) {
  promise
    .then((result) => sendResponse(res, result))
    .catch((error) => sendResponse(res, response(true, null, error.message,[],500)));
}

module.exports = {
  sendResponse: sendResponse,
  response: response,
  handleResponse: handleResponse,
};
