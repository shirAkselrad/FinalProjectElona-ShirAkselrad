const { transporter } = require("../../../services/mailer");

//This function gets an email address and a full name and a recovery code and send it to the user for changing the password
async function sendRecoveryCode(email, fullName, code) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recovery Code - ELONA ",
    html: `
      <div style="
      font-family: Arial, sans-serif;
      background-color: #fbf8f5;
      padding: 40px;
      text-align: center;
    ">

      <h1 style="
        color: #3f332d;
        font-size: 28px;
        letter-spacing: 2px;
      ">
        Recovery Code
      </h1>

      <p style="
        color: #51453e;
        font-size: 16px;
      ">
        Hello ${fullName},
      </p>

      <p style="
        color: #51453e;
        font-size: 15px;
      ">
        This is your recovery code:
      </p>
      <p>${code.join(" ")}</p>

      <div style="
        margin: 30px 0;
        color: #c49a5a;
      ">
        ◆
      </div>

      <p style="
        color: #3f332d;
        font-size: 14px;
      ">
        Exclusive fashion for strong women
      </p>

    </div>`,
  });
}

module.exports = { sendRecoveryCode };
