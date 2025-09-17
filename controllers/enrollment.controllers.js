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

export const getMyCourses = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      let error = new Error("Only students can view this");
      error.statusCode = 403;
      throw error;
    }

    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate({
      path: "course",
      populate: { path: "teacher", select: "name email" },
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStudentsInCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "Teacher") {
      let error = new Error("Only teachers can view this");
      error.statusCode = 403;
      throw error;
    }
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      let error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    if (!course.teacher.equals(req.user._id)) {
      let error = new Error("Not authorised for this course");
      error.statusCode = 403;
      throw error;
    }

    const enrollments = await Enrollment.find({ course: course._id }).populate(
      "student",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};
