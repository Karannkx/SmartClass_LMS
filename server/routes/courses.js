
const router = require("express").Router();
const Course = require("../models/Course");
const verify = require("../verifyToken");

// Create course
router.post("/", verify, async (req, res) => {
  if (req.user.isTeacher || req.user.isAdmin) {
    const newCourse = new Course({
      name: req.body.name,
      createdBy: req.user._id
    });
    try {
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You're not allowed to create courses!");
  }
});

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
