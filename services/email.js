const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH,
    accessToken: process.env.ACCESS_TOKEN,
  },
});

// Verify the connenction configuration
transporter.verify((err, success) => {
  if (err) {
    console.error("Error connecting to email server: ", err);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Expense Tracker"<${process.env.EMAIL_USER}>`, // sender address
      to: String(to), // list of receivers
      subject: String(subject), // Subject line
      text: String(text), // plain text body
      html: String(html), // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

module.exports = sendEmail;
