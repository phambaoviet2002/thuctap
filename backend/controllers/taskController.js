const Task = require("../models/Task");

const taskController = {
    createTask: async (req, res, next) => {
        let task = new Task();

        task.name = req.body.name;
        task.isImportant = req.body.isImportant;
        task.userId = req.body.userId;

        try {
            task = await task.save();

            res.json({
                success: true,
                data: task,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể tạo nhiệm vụ",
                error: error,
            });
        }
    },

    getAllTasks: async (req, res) => {
        const tasks = await Task.find();

        if (!tasks) {
            return res.status(500).json({
                success: false,
                message: "Không có nhiệm vụ nào tồn tại",
            });
        }

        res.json({
            success: true,
            data: tasks,
        });
    },

    getTaskById: async (req, res) => {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(500).json({
                success: false,
                message: "Không tìm thấy tác vụ với ID đã cho",
            });
        }

        res.json({
            success: true,
            data: task,
        });
    },

    updateTask: async (req, res) => {
        const taskExist = await Task.findById(req.query.id);

        if (!taskExist) {
            return res.status(404).json({
                success: false,
                message: "Nhiệm vụ không tìm thấy",
            });
        }

        let task = {
            name: req.body.name,
            description: req.body.description,
            isImportant: req.body.isImportant,
            isFinished: req.body.isFinished,
            userId: req.body.userId,
            labelId: req.body.labelId,
        };

        try {
            task = await Task.findByIdAndUpdate(req.query.id, task, { new: true });

            res.json({
                success: true,
                data: task,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Nhiệm vụ không thể được cập nhật",
                error: error,
            });
        }
    },

    deleteTask: async (req, res) => {
        Task.findByIdAndRemove(req.query.id)
            .then((task) => {
                if (task) {
                    return res.status(200).json({
                        success: true,
                        message: "Nhiệm vụ bị xóa",
                    });
                }

                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy tác vụ với ID đã cho",
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    message: "Nhiệm vụ không thể bị xóa",
                    error: error,
                });
            });
    },
};

module.exports = taskController;
