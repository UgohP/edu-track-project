import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";

export const enrollCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      let error = new Error("Only students can enroll");
      error.statusCode = 403;
      throw error;
    }

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      let error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled Successfully",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};
