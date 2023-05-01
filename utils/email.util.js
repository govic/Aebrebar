const nodemailer = require('nodemailer');
const { mail } = require('../config/email.config');

const emailTransporter = nodemailer.createTransport({
  host: mail.host,
  port: mail.port,
  tls: {
    rejectUnauthorized: false
  },
  secure: false,
  auth: {
    user: mail.user,
    pass: mail.pass
  }
});

const sendEmail = async (email, subject, html) => {
    console.log("entró al sendEmail");
    console.log("email: "+email);
    console.log("mensajito: "+ subject);
    console.log("html: "+ html);

  await emailTransporter.sendMail({
    from: `ARBIM <${ mail.user }>`,
    to: email,
    subject: subject,
    text: 'Para recuperar contraseña presione el link',
    html: html
    
  });
  
}

module.exports = {
  sendEmail
}