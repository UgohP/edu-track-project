import Course from "../models/course.model.js";

/**
 * Api endpoint controller to CREATE a new course
 */
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

    res.status(201).json({
      sucess: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Api endpoint controller to GET all the courses
 */
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

/**
 * Api endpoint controller to GET a particular course
 */
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "teacher",
      "name email"
    );

    if (!course) {
      let error = new Error("Course does not exist");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

/**
 * Api endpoint controller to UPDATE a particular course
 */
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      let error = new Error("Course does not exist");
      error.statusCode = 404;
      throw error;
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      let error = new Error("Not authorised");
      error.statusCode = 401;
      throw error;
    }

    const updates = {
      title: req.body.title,
      description: req.body.description,
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    next(error);
  }
};

/**
 * Api endpoint controller to DELETE a particular course
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      let error = new Error("Course does not exist");
      error.statusCode = 404;
      throw error;
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      let error = new Error("Unauthorised");
      error.statusCode = 401;
      throw error;
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
