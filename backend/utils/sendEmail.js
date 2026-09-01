const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Gunakan Ethereal Mail (fake SMTP) untuk testing jika credential asli belum ada.
    // Ethereal Mail secara otomatis mencegat email dan memberikan link preview di terminal.
    
    // Konfigurasi Asli menggunakan .env:
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Jika SMTP_USER tidak didefinisikan di .env, kita gunakan Ethereal untuk fallback testing
    if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('ethereal')) {
       const testAccount = await nodemailer.createTestAccount();
       transporter.options.auth = {
         user: testAccount.user,
         pass: testAccount.pass
       };
    }

    const info = await transporter.sendMail({
      from: '"OIER UIN Siber" <no-reply@oier.uinsiber.ac.id>',
      to,
      subject,
      text,
      html
    });

    console.log("=========================================");
    console.log("✉️  Email terkirim! (Simulasi Ethereal)");
    console.log("🔗 URL Preview Email: %s", nodemailer.getTestMessageUrl(info));
    console.log("=========================================");

    return { success: true, info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

module.exports = sendEmail;
