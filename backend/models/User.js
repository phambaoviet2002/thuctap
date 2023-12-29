const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sha256 = require("crypto-js/sha256");
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 6,
            maxLength: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            minlength: 10,
            maxLength: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    { timestamps: true }
);
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods = {
    isValidPassword: async function (password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw error;
        }
    },
    createChangePasswordToken() {
        const key = "2wpowcczxcxznnmjdeaior@@@##";
        const passwordResetExpires = Date.now() + 5 * 60 * 1000;
        const passwordReset = sha256(this.email + key + passwordResetExpires).toString();
        this.resetPasswordExpires = passwordResetExpires;
        this.resetPasswordToken = passwordReset;
        return {
            passwordReset,
            passwordResetExpires,
        };
    },
};

module.exports = mongoose.model("User", userSchema);
