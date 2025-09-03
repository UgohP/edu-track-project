const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.log(err);

    //Mongoose bad ObjectId
    if (err.name === "CastError") {
      let message = "Resourse not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    //Mongoose duplicate key
    if (err.code === 11000) {
      let message = "Dupicate field, value entered";
      error = new Error(message);
      error.statusCode = 409;
    }

    //Validation Error
    if (err.name === "ValidationError") {
      let message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
