const { transporter } = require("../../../services/mailer");

//This function gets an email address and a full name and send a registeration comfirm mail to the new user's email address
async function sendRegisterationMail(email, fullName) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to ELONA",
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
        WELCOME TO ELONA
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
        Your account has been created successfully.
      </p>

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

module.exports = { sendRegisterationMail };
