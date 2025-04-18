const nodemailer = require("nodemailer");

async function sendEmail(to, subject, recipientName, sujetName ) {
  try {
   
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io", // Mailtrap SMTP host
      port: 2525, // Mailtrap SMTP port
      secure: false, // true for 465, false for other ports
      auth: {
        user: "93d4d6c31b3ed6",
        pass: "70bf9eba329ec8",
      },
    });

    // Define the HTML email body
    const htmlBody = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Congratulations on Your D-Talk Internship Acceptance</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

      body {
        font-family: "Inter", Arial, sans-serif;
        background-color: #f9f5f0;
        margin: 0;
        padding: 0;
        color: #333333;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }

      .header {
        background-color: #b89048;
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }

      .header p {
        margin: 10px 0 0;
        font-size: 16px;
        opacity: 0.9;
      }

      .content {
        padding: 30px 20px;
        line-height: 1.6;
      }

      .section {
        margin-bottom: 25px;
      }

      .section-title {
        font-size: 20px;
        font-weight: 600;
        color: #b89048;
        margin-bottom: 10px;
      }

      .feature {
        display: flex;
        margin-bottom: 15px;
        align-items: flex-start;
      }

      .feature-icon {
        width: 40px;
        height: 40px;
        background-color: rgba(184, 144, 72, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        flex-shrink: 0;
      }

      .feature-content {
        flex: 1;
      }

      .feature-title {
        font-weight: 600;
        margin: 0 0 5px;
      }

      .feature-text {
        margin: 0;
        color: #666666;
      }

      .cta-button {
        display: inline-block;
        background-color: #b89048;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        margin-top: 10px;
      }

      .testimonial {
        background-color: #f9f5f0;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .testimonial-text {
        font-style: italic;
        margin-bottom: 10px;
      }

      .testimonial-author {
        font-weight: 600;
        margin: 0;
      }

      .testimonial-role {
        color: #666666;
        margin: 0;
        font-size: 14px;
      }

      .footer {
        text-align: center;
        padding: 20px;
        background-color: #f9f5f0;
        font-size: 14px;
        color: #666666;
      }

      .social-links {
        margin: 15px 0;
      }

      .social-link {
        display: inline-block;
        margin: 0 5px;
      }

      @media only screen and (max-width: 480px) {
        .header h1 {
          font-size: 24px;
        }

        .section-title {
          font-size: 18px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Congratulations on Joining D-Talk's Internship Program!</h1>
   
      </div>

      <div class="content">
        <p>Hello ${recipientName || "New Intern"},</p>

        <p>
          We are thrilled to welcome you to D-Talk's Summer 2025 Internship
          Program! Your talent and passion stood out during the selection
          process, and we're excited to have you on board.
        </p>

        <p>
            You've been accepted to the Internship : <b> ${sujetName} </b> 
          </p>

        <div class="section" style="text-align: center">
          <p><strong>Let’s make this summer unforgettable!</strong></p>
          <a href="https://d-talk.com/internships/onboarding" class="cta-button"
            >Access Your Account</a
          >
        </div>

        <div class="section">
          <p>
            If you have any questions or need assistance, feel free to reach out
            to us at
            <a href="mailto:internships@d-talk.com">internships@d-talk.com</a>.
          </p>
          <p>
            Welcome to the team, and we can’t wait to see what you’ll achieve!
          </p>
          <p>Best regards,<br />The D-Talk Team</p>
        </div>
      </div>

      <div class="footer">
        <div class="social-links">
          <a href="https://facebook.com/dtalk" class="social-link">Facebook</a>
          |
          <a href="https://instagram.com/dtalk" class="social-link"
            >Instagram</a
          >
          |
          <a href="https://linkedin.com/company/dtalk" class="social-link"
            >LinkedIn</a
          >
        </div>
        <p>© 2025 D-Talk. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

    // Define the email options
    const mailOptions = {
      from: '"D-Talk Internships" <internships@d-talk.com>', // Sender address
      to: to, // Recipient address
      subject: subject, // Subject line
      html: htmlBody, // HTML body
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}


module.exports = { sendEmail };
