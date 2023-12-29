const taskLabelController = require("../controllers/taskLabelController");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require("../controllers/verifyToken");

const router = require("express").Router();

router.post("/", (req, res) => {
    taskLabelController.createTaskLabel(req, res);
});

router.get("/", (req, res) => {
    taskLabelController.getAllTaskLabels(req, res);
});

router.get("/:id", (req, res) => {
    taskLabelController.getTaskLabelById(req, res);
});

router.put("/", (req, res) => {
    taskLabelController.updateTaskLabel(req, res);
});

router.delete("/", (req, res) => {
    taskLabelController.deleteTaskLabel(req, res);
});

module.exports = router;
