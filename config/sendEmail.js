import nodemailer from "nodemailer";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "manobalaarul@gmail.com", // Your email
    pass: "oumu whyf ctkk rhyx", // Your email password or app password
  },
});

const sendEmail = async ({ sendTo, subject, html }) => {
  // Email options+
  const mailOptions = {
    from: "manobalaarul@gmail.com",
    to: sendTo,
    subject: subject,
    html: html,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendEmail;
