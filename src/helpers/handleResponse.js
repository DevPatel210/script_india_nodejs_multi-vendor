function sendResponse(response, result) {
  return response
    .set(
      result.headers ? result.headers : { "Content-Type": "application/json" }
    )
    .status(200)
    .send(result);
}

function response(err, displayMsg, techMsg, data = []) {
  if (err) {
    displayMsg = displayMsg || "Something Went Wrong";
    return { isSuccess: false, displayMsg, techMsg, data };
  }
  return { isSuccess: true, displayMsg, techMsg, data };
}

function handleResponse(promise, res) {
  promise
    .then((result) => sendResponse(res, result))
    .catch((error) => sendResponse(res, response(true, null, error.message)));
}

module.exports = {
  sendResponse: sendResponse,
  response: response,
  handleResponse: handleResponse,
};
