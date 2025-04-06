const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const subjectRoute = require("./routes/subjects");
const materialRoute = require("./routes/materials");
const taskRoute = require("./routes/tasks");
const doubtRoute = require("./routes/doubts");
const scheduleRoute = require("./routes/schedules");
const classCommentRoute = require("./routes/classComments");
const courseRoute = require("./routes/courses");
const groupVideoCallSocket = require("./socket/groupVideoCall");
const User = require("./models/User");
const CryptoJS = require("crypto-js");

// config for dotenv
dotenv.config();

// Create default admin teacher if not exists
const createDefaultTeacher = async () => {
  try {
    if (!process.env.CRYPTOJS_SECRET_KEY) {
      console.error("CRYPTOJS_SECRET_KEY not found in environment variables");
      return;
    }
    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const adminTeacher = new User({
        email: adminEmail,
        fullname: "Admin Teacher",
        password: CryptoJS.AES.encrypt("admin123", process.env.CRYPTOJS_SECRET_KEY).toString(),
        isTeacher: true,
        isAdmin: true,
        course: "ALL",
        semester: "ALL"
      });
      await adminTeacher.save();
      console.log("Default admin teacher created successfully");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};

// Connect DB
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    family: 4,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    retryWrites: true,
    w: "majority",
    maxPoolSize: 10
  })
  .then(async () => {
    console.log("DB connected");
    await createDefaultTeacher();
    const Course = require('./models/Course');
    await Course.createDefaultCourses();
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// routes
app.get("/", (req, res) => res.send("SmartClass is running :)"));
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/subject", subjectRoute);
app.use("/api/material", materialRoute);
app.use("/api/task", taskRoute);
app.use("/api/doubt", doubtRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/classcomment", classCommentRoute);
app.use("/api/courses", courseRoute);

// sockets
groupVideoCallSocket(io);

// Port setup
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("SmartClass is running on:" + port);
});