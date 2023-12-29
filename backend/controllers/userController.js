const User = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
    getAllUsers: async (req, res, next) => {
        const userList = await User.find().select("-password");

        if (!userList) {
            return res.status(500).json({
                success: false,
                message: "Không có người dùng nào tồn tại",
            });
        }

        res.json({
            success: true,
            data: userList,
        });
    },

    getUserById: async (req, res, next) => {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Không có người dùng nào tồn tại",
            });
        }

        res.json({
            success: true,
            data: user,
        });
    },

    updateUser: async (req, res, next) => {
        const { id } = req.params;
        let avatar = req.file ? req.file.path : req.body.avatar;
        const { username, email } = req.body;
        try {
            const user = await User.findByIdAndUpdate(id, {
                username,
                email,
                avatar,
            });
            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "Không có người dùng nào tồn tại",
                });
            }
            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể cập nhật người dùng",
                error: error,
            });
        }
    },

    deleteUser: async (req, res, next) => {
        User.findByIdAndRemove(req.params.id)
            .then((user) => {
                if (user) {
                    return res.status(200).json({
                        success: true,
                        message: "Người dùng đã bị xóa!",
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "Người dùng không được tìm thấy",
                    });
                }
            })
            .catch((error) => {
                return res.status(500).json({
                    success: false,
                    error: error,
                });
            });
    },

    getUserCount: async (req, res, next) => {
        const userCount = await User.countDocuments({});

        if (!userCount || userCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Không có người dùng nào tồn tại",
            });
        }

        res.json({
            success: true,
            data: userCount,
        });
    },

    getUserProfile: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId).select("-password");

            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "Không tìm thấy người dùng",
                });
            }

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Không thể lấy thông tin người dùng",
                error: error,
            });
        }
    },
};

module.exports = userController;
