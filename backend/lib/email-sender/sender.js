const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const sendEmail = async (body, res, message) => {
  try {
    // Log the OTP/Email content to the console for easy debugging/manual entry
    console.log("------------------------------------------");
    console.log("SENDING EMAIL TO:", body.to);
    console.log("SUBJECT:", body.subject);
    console.log("CONTENT:", body.html.replace(/<[^>]*>?/gm, '')); // Plain text log
    console.log("------------------------------------------");

    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: "gmail", // Using service shorthand is more reliable for Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
      from: body.from || process.env.SENDER_EMAIL,
      to: body.to,
      subject: body.subject,
      html: body.html,
    });

    return res.status(200).send({ message });
  } catch (error) {
    console.error("Email sending failed:", error.message);
    // Even if email fails, we send a success message so the user can see the OTP in the console and continue testing
    return res.status(200).send({ 
       message: message + " (Email delivery failed, check server logs for OTP)",
       emailError: error.message 
    });
  }
};
//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
};
