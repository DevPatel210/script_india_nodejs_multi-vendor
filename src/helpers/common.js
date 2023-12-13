const handleResponse = require("./handleResponse");
const message = require("./message");

module.exports = {
    response: handleResponse.response,
    handleResponse: handleResponse.handleResponse,
    resMessage: message
}