const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const port = process.env.PORT || 3000;

//This routes is for each page in the front end
const registerPageRoutes = require("./routes/register");
const loginPageRoutes = require("./routes/login");
const shopPageRoutes = require("./routes/shop");
const employeePageRoutes = require("./routers/employee");
const managerPageRoutes = require("./routers/manager");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "FE")));
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
app.use("manager", managerPageRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "FE", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = port;
