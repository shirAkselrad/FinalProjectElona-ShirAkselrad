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
const headerRoutes = require("./routes/header");

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

app.use("/api/register", registerPageRoutes);
app.use("/api/login", loginPageRoutes);
app.use("/api/shop", shopPageRoutes);
app.use("/api/employee", employeePageRoutes);
app.use("/api/manager", managerPageRoutes);
app.use("/api/forgotPassword", forgotPasswordPageRoutes);
app.use("/api/recoveryPage", recoveryPageRoutes);
app.use("/api/resetPassword", resetPasswordRoutes);
app.use("/api/header", headerRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = port;
