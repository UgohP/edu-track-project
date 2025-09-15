import mongoose from "mongoose";

/**
 * The model for the course
 *
 * Fields:
 *      title: The course title
 *      description: the course description
 *      teacher: the teacher that owns the course
 *      students: the students that are enrolled in the course
 */
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxLength: 500,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Every course must have a teacher'],
      ref: "User",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

CourseSchema.index({ teacher: 1 });
CourseSchema.index({ title: "text", description: "text" });

const Course = mongoose.model("Course", CourseSchema);
export default Course;
