const authController = require("../controllers/authController");
const forgotPassword = require("../controllers/forgot-password");

const router = require("express").Router();
const { verifyToken } = require("../controllers/verifyToken");

//REGISTER
router.post("/register", (req, res) => {
    authController.registerUser(req, res);
});

//REFRESH TOKEN
router.post("/refresh", (req, res) => {
    authController.requestRefreshToken(req, res);
});
//LOG IN
router.post("/login", (req, res) => {
    authController.loginUser(req, res);
});
//LOG OUT
router.post("/logout", (req, res) => {
    authController.userLogout(req, res);
});


router.post("/forgot-password", forgotPassword.forgotPassword);
//RESET PASSWORD
router.post("/reset-password", forgotPassword.verifyPasswordToken);

module.exports = router;
