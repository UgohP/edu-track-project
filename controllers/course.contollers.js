import Course from "../models/course.model.js";

export const createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (req.user.role !== "Teacher") {
      let error = new Error("Only teachers can create a course");
      error.statusCode = 403;
      throw error;
    }

    const course = await Course.create({
      title,
      description,
      teacher: req.user._id,
    });

    res
      .status(201)
      .json({
        sucess: true,
        message: "Course created successfully",
        data: course,
      });
  } catch (error) {
    next(error);
  }
};
