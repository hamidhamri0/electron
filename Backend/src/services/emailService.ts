import nodemailer from "nodemailer";
import { generateEmailTemplate } from "../template/emailTemplate";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "abdel31hamid@gmail.com", // Replace with your email
    pass: "yrov jchu utek sope", // Replace with your email password
  },
});

export const sendEmailConfirmation = async (to: string, token: string) => {
  const confirmationUrl = `http://localhost:5173/verifying-email?token=${token}`;

  const mailOptions = {
    from: '"Abdelhamid" <your-email@example.com>', // Sender address
    to, // List of recipients
    subject: "Email Confirmation", // Subject line
    html: generateEmailTemplate(confirmationUrl), // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
