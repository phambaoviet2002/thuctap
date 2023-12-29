const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        isImportant: {
            type: Boolean,
            required: true,
        },
        isFinished: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: String,
            required: true,
        },
        labelId: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
