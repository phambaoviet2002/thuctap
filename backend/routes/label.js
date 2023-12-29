const labelController = require("../controllers/labelController");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require("../controllers/verifyToken");

const router = require("express").Router();

router.post("/", (req, res) => {
    labelController.createLabel(req, res);
});

router.get("/", (req, res) => {
    labelController.getAllLabels(req, res);
});

router.get("/:id", (req, res) => {
    labelController.getLabelById(req, res);
});

router.put("/", (req, res) => {
    labelController.updateLabel(req, res);
});

router.delete("/", (req, res) => {
    labelController.deleteLabel(req, res);
});

module.exports = router;
