const path = require("path");
require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const port = process.env.PORT || 3001;

//This routes is for each page in the front end
const registerPageRoutes = require("./routes/register");
const loginPageRoutes = require("./routes/login");
const shopPageRoutes = require("./routes/shop");
const employeePageRoutes = require("./routes/employee");
const managerPageRoutes = require("./routes/manager");
const forgotPasswordPageRoutes = require("./routes/forgotPassword");
const recoveryPageRoutes = require("./routes/recoveryPage");
const resetPasswordRoutes = require("./routes/resetPassword");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "Front-End")));
//for the session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use("/register", registerPageRoutes);
app.use("/login", loginPageRoutes);
app.use("/shop", shopPageRoutes);
app.use("/employee", employeePageRoutes);
app.use("/manager", managerPageRoutes);
app.use("/forgotPassword", forgotPasswordPageRoutes);
app.use("/recoveryPage", recoveryPageRoutes);
app.use("/resetPassword", resetPasswordRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = port;
