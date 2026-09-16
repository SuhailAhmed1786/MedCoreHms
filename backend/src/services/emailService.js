const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
//  const verificationUrl =`http://localhost:5000/api/auth/verify-email/${token}`;
  
  console.log("Sending verification email to:", email);
  console.log("Verification URL:", verificationUrl);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your MedCore HMS account",

    html: `
      <h2>Welcome to MedCore HMS</h2>

      <p>Your account has been created successfully.</p>

      <p>Please click the button below to verify your email.</p>

      <a href="${verificationUrl}"
         style="
           display:inline-block;
           padding:10px 20px;
           background:#2563eb;
           color:white;
           text-decoration:none;
           border-radius:5px;
         ">
        Verify Email
      </a>

      <p>This link expires in 15 minutes.</p>
    `,
  });

  console.log("Verification email sent:", info.messageId);

  return info;
};

module.exports = {
  sendVerificationEmail,
};