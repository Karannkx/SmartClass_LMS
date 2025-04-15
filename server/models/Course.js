
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Add default courses if they don't exist
CourseSchema.statics.createDefaultCourses = async function() {
  const defaultCourses = ['BCA', 'BBA', 'BTech', 'BSc', 'BCom'];
  for (const course of defaultCourses) {
    await this.findOneAndUpdate(
      { name: course },
      { name: course, isDefault: true },
      { upsert: true }
    );
  }
};

module.exports = mongoose.model("Course", CourseSchema);
