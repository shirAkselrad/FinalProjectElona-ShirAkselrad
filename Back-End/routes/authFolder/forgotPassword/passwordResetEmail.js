const { transporter } = require("../../../services/mailer");

const dbSingleton = require("../../../dbSingleton");
const db = dbSingleton.getConnection();

// Sends confirmation email after password reset
const sendMailNewPassword = (req, res, next) => {
  const email = req.session.email;

  const query = "select first_name, last_name from users where email=?";

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      console.error("Error getting user details for password email:", err);
      return next();
    }

    const fullName = results[0].first_name + " " + results[0].last_name;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset - ELONA",
        html: `
          <div style="
            font-family: Georgia, serif;
            background-color: #fbf8f5;
            padding: 40px;
            text-align: center;
          ">
            <h1 style="
              color: #4b1426;
              font-size: 28px;
              font-weight: 400;
              letter-spacing: 2px;
            ">
              PASSWORD UPDATED
            </h1>

            <p style="color: #80606b; font-size: 16px;">
              Hello ${fullName},
            </p>

            <p style="color: #80606b; font-size: 15px;">
              Your password was reset successfully.
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
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }

    next();
  });
};

module.exports = { sendMailNewPassword };
