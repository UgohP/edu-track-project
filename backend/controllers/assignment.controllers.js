import Assignment from "../models/assignment.model.js";
import Course from "../models/course.model.js";
import Submission from "../models/submission.model.js";

// Create assignment (Teacher only)
export const createAssignment = async (req, res, next) => {
  try {
    const findCourse = await Course.findById(req.params.courseId);

    if (!findCourse) {
      let error = new Error("Course does not exist");
      error.statusCode = 404;
      throw error;
    }

    const assignment = await Assignment.create({
      title: req.body.title,
      description: req.body.description,
      course: req.params.courseId,
      teacher: req.user._id,
      dueDate: req.body.dueDate,
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// Get assignments for a course (Students & Teachers)
export const getAssignmentsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId }).sort({
      dueDate: 1,
    });
    res.json({ success: true, assignments });
  } catch (error) {
    next(error);
  }
};

// Submit assignment (Student only)
export const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      content,
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};

// Get submissions for an assignment (Teacher only)
export const getSubmissions = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({
      assignment: assignmentId,
    }).populate("student", "name email");
    res.json({ success: true, submissions });
  } catch (error) {
    next(error);
  }
};

// Mark submission as reviewed (Teacher only)
export const markReviewed = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { reviewed: true },
      { new: true }
    );
    res.json({ success: true, submission });
  } catch (error) {
    next(error);
  }
};
