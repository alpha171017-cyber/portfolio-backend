import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// CONTACT FORM ROUTE
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, message: "All fields required" });
  }

  try {
    // Mail Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email Details
    await transporter.sendMail({
      from: email,
      to: process.env.MAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Mail Error:", error);
    res.json({ success: false, message: "Email failed to send" });
  }
});

// DEPLOYMENT PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
