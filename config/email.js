const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Error in email configuration:", error);
  } else {
    console.log("Email server is ready to take our messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Expense Tracker"<${process.env.EMAIL_USER}>`, // sender address
      to: String(to), // ensure 'to' is a string
      subject: String(subject), // ensure 'subject' is a string
      text: String(text), // ensure 'text' is a string
      html: String(html), // ensure 'html' is a string
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("Error in sending email", error.message);
  }
};
