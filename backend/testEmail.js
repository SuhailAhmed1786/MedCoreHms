// require("dotenv").config();

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function testEmail() {
//   try {
//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
//     console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

//     await transporter.verify();

//     console.log("SMTP connection successful");

//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: "YOUR_TEST_EMAIL@gmail.com",
//       subject: "MedCore HMS Test Email",
//       text: "This is a test email from MedCore HMS.",
//     });

//     console.log("Email sent successfully");
//     console.log("Message ID:", info.messageId);
//   } catch (error) {
//     console.error("Email test failed:", error);
//   }
// }

// testEmail();