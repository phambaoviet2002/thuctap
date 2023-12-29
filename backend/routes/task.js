const taskController = require("../controllers/taskController");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndUserAuthorization } = require("../controllers/verifyToken");

const router = require("express").Router();

router.post("/", (req, res) => {
    taskController.createTask(req, res);
});

router.get("/", (req, res) => {
    taskController.getAllTasks(req, res);
});

router.get("/:id", (req, res) => {
    taskController.getTaskById(req, res);
});

router.put("/", (req, res) => {
    taskController.updateTask(req, res);
});

router.delete("/", (req, res) => {
    taskController.deleteTask(req, res);
});

module.exports = router;
