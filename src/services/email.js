const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD 
  }
})

async function sendEmail(to, subject, message, onlyToSender=false){
  const mail_options = {
    from: process.env.EMAIL_USER,
    to: onlyToSender ? [to] : [process.env.EMAIL_USER,to],
    subject: subject,
    html: message
  }

  try {
    const response = await transporter.sendMail(mail_options);
  } catch (error) {
    console.log(error);
    throw new Error(`Error in sending email: ${JSON.stringify(error)}`);
  }
}

module.exports = {
  sendEmail
}