const Label = require("../models/Label");

const labelController = {
    createLabel: async (req, res, next) => {
        let label = new Label();

        label.name = req.body.name;

        try {
            label = await label.save();

            res.json({
                success: true,
                data: label,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể tạo nhãn",
                error: error,
            });
        }
    },

    getAllLabels: async (req, res) => {
        const labels = await Label.find();

        if (!labels) {
            return res.status(500).json({
                success: false,
                message: "Không có nhãn nào tồn tại",
            });
        }

        res.json({
            success: true,
            data: labels,
        });
    },

    getLabelById: async (req, res) => {
        const label = await Label.findById(req.params.id);

        if (!label) {
            return res.status(500).json({
                success: false,
                message: "Không tìm thấy nhãn với ID đã cho",
            });
        }

        res.json({
            success: true,
            data: label,
        });
    },

    updateLabel: async (req, res) => {
        const labelExist = await Label.findById(req.query.id);

        if (!labelExist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy nhãn",
            });
        }

        let label = {
            name: req.body.name,
        };

        try {
            label = await Label.findByIdAndUpdate(req.query.id, label, { new: true });

            res.json({
                success: true,
                data: label,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể cập nhật nhãn",
                error: error,
            });
        }
    },

    deleteLabel: async (req, res) => {
        Label.findByIdAndRemove(req.query.id)
            .then((label) => {
                if (label) {
                    return res.status(200).json({
                        success: true,
                        message: "Nhãn đã bị xóa",
                    });
                }

                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy nhãn với ID đã cho",
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    message: "Không thể xóa nhãn",
                    error: error,
                });
            });
    },
};

module.exports = labelController;
