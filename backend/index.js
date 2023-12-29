const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");
const labelRoute = require("./routes/label");
const taskLabelRoute = require("./routes/taskLabel");
dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTED TO MONGO DB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/task", taskRoute);
app.use("/v1/label", labelRoute);
app.use("/v1/task-label", taskLabelRoute);

app.listen(8000, () => {
    console.log("Server is running");
});
