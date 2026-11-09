const path = require("path");
require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const port = process.env.PORT || 3001;

// Authentication
const registerPageRoutes = require("./routes/authFolder/register/register");
const loginPageRoutes = require("./routes/authFolder/login/login");
const forgotPasswordPageRoutes = require("./routes/authFolder/forgotPassword/forgotPassword");
const recoveryPageRoutes = require("./routes/authFolder/forgotPassword/checkRecoveryCode");
const resetPasswordRoutes = require("./routes/authFolder/forgotPassword/resetPassword");
const headerRoutes = require("./routes/authFolder/logout");

// Shop
const shopPageRoutes = require("./routes/shopFolder/shopPage/shop");

// Client
const cartRoutes = require("./routes/clientFolder/cart/cart");
const startCheckoutRoutes = require("./routes/clientFolder/checkout/startCheckout");
const orderSummaryRoutes = require("./routes/clientFolder/checkout/getOrderSummary");
const editClientDetailsRoutes = require("./routes/clientFolder/details/details");
const paymentRoutes = require("./routes/clientFolder/payment/payment");
const orderReviewRoutes = require("./routes/clientFolder/client");

// User
const editMyAccountRoutes = require("./routes/userFolder/user");

// Employee and Manager
const employeePageRoutes = require("./routes/employeeFolder/employee");
const managerPageRoutes = require("./routes/managerFolder/manager");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "Front-End")));

// Session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Authentication
app.use("/api/register", registerPageRoutes);
app.use("/api/login", loginPageRoutes);
app.use("/api/forgotPassword", forgotPasswordPageRoutes);
app.use("/api/recoveryPage", recoveryPageRoutes);
app.use("/api/resetPassword", resetPasswordRoutes);
app.use("/api/header", headerRoutes);

// Shop
app.use("/api/shop", shopPageRoutes);

// Client
app.use("/api/cart", cartRoutes);
app.use("/api/cart", startCheckoutRoutes);
app.use("/api/orderSummary", orderSummaryRoutes);
app.use("/api/client", editClientDetailsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orderReview", orderReviewRoutes);

// User
app.use("/api/editMyAccount", editMyAccountRoutes);

// Employee and Manager
app.use("/api/employee", employeePageRoutes);
app.use("/api/manager", managerPageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = port;
