const mongoose = require("mongoose");

const taskLabelSchema = new mongoose.Schema(
    {
        taskId: {
            type: String,
            required: true,
        },
        labelId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TaskLabel", taskLabelSchema);
