const TaskLabel = require("../models/TaskLabel");

const taskLabelController = {
    createTaskLabel: async (req, res, next) => {
        let taskLabel = new TaskLabel();

        taskLabel.taskId = req.body.taskId;
        taskLabel.labelId = req.body.labelId;

        try {
            taskLabel = await taskLabel.save();

            res.json({
                success: true,
                data: taskLabel,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể tạo nhãn nhiệm vụ!",
                error: error,
            });
        }
    },

    getAllTaskLabels: async (req, res) => {
        const taskLabels = await TaskLabel.find();

        if (!taskLabels) {
            return res.status(500).json({
                success: false,
                message: "Không có nhãn nhiệm vụ nào tồn tại!",
            });
        }

        res.json({
            success: true,
            data: taskLabels,
        });
    },

    getTaskLabelById: async (req, res) => {
        const taskLabel = await TaskLabel.findById(req.params.id);

        if (!taskLabel) {
            return res.status(500).json({
                success: false,
                message: "Không tìm thấy nhãn tác vụ có ID đã cho!",
            });
        }

        res.json({
            success: true,
            data: taskLabel,
        });
    },

    updateTaskLabel: async (req, res) => {
        const taskLabelExist = await TaskLabel.findById(req.query.id);

        if (!taskLabelExist) {
            return res.status(404).json({
                success: false,
                message: "Nhãn nhiệm vụ không tìm thấy!",
            });
        }

        let taskLabel = {
            taskId: req.body.taskId,
            labelId: req.body.labelId,
        };

        try {
            taskLabel = await Task.findByIdAndUpdate(req.query.id, taskLabel, { new: true });

            res.json({
                success: true,
                data: taskLabel,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể cập nhật nhãn nhiệm vụ!",
                error: error,
            });
        }
    },

    deleteTaskLabel: async (req, res) => {
        TaskLabel.findByIdAndRemove(req.query.id)
            .then((taskLabel) => {
                if (taskLabel) {
                    return res.status(200).json({
                        success: true,
                        message: "Nhãn nhiệm vụ đã bị xóa",
                    });
                }

                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy nhãn tác vụ có ID đã cho!",
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    message: "Không thể xóa nhãn nhiệm vụ!",
                    error: error,
                });
            });
    },
};

module.exports = taskLabelController;
