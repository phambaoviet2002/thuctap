const userController = require("../controllers/userController");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require("../controllers/verifyToken");

const fileUpload = require("../middleware/cloudinary");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, (req, res, next) => {
    userController.getAllUsers(req, res, next);
});

//GET USER BY ID
router.get("/:id", verifyTokenAndUserAuthorization, (req, res, next) => {
    userController.getUserById(req, res, next);
});

//UPDATE USER
router.put("/:id", fileUpload.single("avatar"), verifyTokenAndUserAuthorization, (req, res, next) => {
    userController.updateUser(req, res, next);
});

//DELETE USER
router.delete("/:id", verifyTokenAndUserAuthorization, (req, res, next) => {
    userController.deleteUser(req, res, next);
});

module.exports = router;
