const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAILID,
    pass: process.env.PASS,
  },
});
const sendMail= async(data)=>{

    const info = await transporter.sendMail({
      from: process.env.EMAILID,
      to: data.email,
      subject: data.subject,
      text: data.txt,
      html: data.html,
    });
    console.log("Message sent: %s", info.messageId);
  }
module.exports=sendMail;