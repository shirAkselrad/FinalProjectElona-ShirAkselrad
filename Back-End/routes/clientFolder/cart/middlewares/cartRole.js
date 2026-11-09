//This middleware checks if the user is client, in case it does then next, else matched message to the popup
const checkingRole = (req, res, next) => {
  const user = req.session.user;

  //no user is logged in
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please log in to add products to your cart",
    });
  }

  //user role is not client (cannot create new order)
  if (user.role !== "Client") {
    return res.status(403).json({
      success: false,
      message: "Only clients can add products to the cart",
    });
  }

  next();
};

module.exports = { checkingRole };
