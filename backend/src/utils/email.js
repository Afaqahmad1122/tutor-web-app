import nodemailer from "nodemailer";

/**
 * Create email transporter using SMTP credentials from .env
 * @returns {nodemailer.Transporter} Configured email transporter
 */
function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password from Gmail
    },
    tls: {
      rejectUnauthorized: false, // For development only
    },
  });

  return transporter;
}

/**
 * Verify email configuration and connection
 * @returns {Promise<boolean>} True if email configuration is valid
 */
export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    return false;
  }
}

/**
 * Send OTP email to user
 * @param {string} to - Recipient email address
 * @param {string} otp - OTP code to send
 * @returns {Promise<{success: boolean, messageId?: string}>} Send result
 */
export async function sendOTPEmail(to, otp) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Tutor App" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Your OTP Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .otp-box { background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Email Verification</h2>
            <p>Hello,</p>
            <p>Your OTP verification code is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Tutor App. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your OTP verification code is: ${otp}. This code will expire in 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 OTP email sent to ${to}. Message ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Test email configuration by sending a test email
 * @param {string} testEmail - Email address to send test email to
 * @returns {Promise<{success: boolean, message?: string}>} Test result
 */
export async function testEmailConfig(testEmail) {
  try {
    // First verify configuration
    const isVerified = await verifyEmailConfig();
    if (!isVerified) {
      return {
        success: false,
        message: "Email configuration verification failed",
      };
    }

    // Send test email
    const otp = "123456"; // Dummy OTP for testing
    const result = await sendOTPEmail(testEmail, otp);

    return {
      success: true,
      message: `Test email sent successfully to ${testEmail}`,
      messageId: result.messageId,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to send test email",
    };
  }
}
