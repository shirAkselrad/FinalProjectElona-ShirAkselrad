const express = require("express");
const router = express.Router();

const usersRoutes = require("./manager/users");
const categoriesRoutes=require("./manager/categories");

//this middleware check if the user is a manager
const checkIfManager = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({
      success: false,
      message: "User is not logged in",
    });
  if (req.session.user.role?.toLowerCase() !== "manager")
    return res.status(403).json({
      success: false,
      message: "Access denied. Managers only!",
    });
  next();
};

router.use("/", checkIfManager);
router.use("/", usersRoutes);
router.use("/", categoriesRoutes); 

module.exports = router;
