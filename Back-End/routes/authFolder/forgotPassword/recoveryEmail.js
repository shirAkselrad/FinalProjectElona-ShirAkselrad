const { transporter } = require("../../../services/mailer");

// Sends a password recovery code to the user's email
async function sendRecoveryCode(email, fullName, code) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Recovery - ELONA",
    html: `
      <div style="
        font-family: Georgia, serif;
        background-color: #fbf8f5;
        padding: 40px 20px;
        text-align: center;
      ">
        <h1 style="
          color: #4b1426;
          font-size: 30px;
          font-weight: 400;
          letter-spacing: 2px;
          margin-bottom: 30px;
        ">
          Password Recovery
        </h1>

        <p style="
          color: #80606b;
          font-size: 16px;
        ">
          Hello ${fullName},
        </p>

        <p style="
          color: #80606b;
          font-size: 15px;
          line-height: 1.8;
        ">
          Use the following code to reset your password:
        </p>

        <div style="
          margin: 30px auto;
          padding: 20px;
          max-width: 280px;
          background-color: #f6f0e9;
          border: 1px solid #e2cdd2;
        ">
          <span style="
            color: #4b1426;
            font-family: Arial, sans-serif;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 7px;
          ">
            ${code.join("")}
          </span>
        </div>

        <p style="
          color: #9d6578;
          font-size: 12px;
          line-height: 1.8;
        ">
          This code will expire in 5 minutes.
        </p>

        <div style="
          margin: 30px 0;
          color: #d8afa6;
          font-size: 20px;
        ">
          ◆
        </div>

        <p style="
          color: #4b1426;
          font-size: 13px;
          letter-spacing: 1px;
        ">
          Exclusive fashion for strong women
        </p>
      </div>
    `,
  });
}

module.exports = { sendRecoveryCode };
