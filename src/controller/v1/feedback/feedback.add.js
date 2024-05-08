const Feedback = require("../../../models/feedback.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
  model: Feedback,
});
const { sendEmail } = require("../../../services/email");
const { response, resMessage } = require("../../../helpers/common");

exports.add = async (req) => {
  try {
    const feedback = await makeMongoDbService.createDocument(req.body);
    const message = getFeedbackMessage(req.body);
    await sendEmail("drjacks@obu.edu", "New message received", message); // Updated email address
    return response(false, resMessage.success, null, feedback, 201);
  } catch (error) {
    console.log(error);
    throw response(true, null, error.message, error.stack, 500);
  }
};

function getFeedbackMessage({ name, email, message }) {
  return `
		A new message is submitted. Please find the details below:
    <br><br>
    - Name: ${name} <br>
    - Email: ${email} <br>
    - Message: ${message} <br>
	`;
}
