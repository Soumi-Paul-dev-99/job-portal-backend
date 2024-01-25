// const errorMiddleware = (err, req, res, next) => {
//   console.log(err);
//   const defaulterrors = {
//     statusCode: 500,
//     message: err,
//   };
//   //missing filled error
//   if (err.name === "ValidationError") {
//     defaulterrors.statusCode = 400;
//     defaulterrors.message = Object.values(err.errors)
//       .map((item) => item.message)
//       .join(",");
//   }

//   //duplicate error
//   if (err.code && err.code === 11000) {
//     defaulterrors.statusCode = 400;
//     defaulterrors.message = `${Object.keys(
//       err.keyValue
//     )} field has to be unique`;
//   }
//   res.status(defaulterrors.statusCode).json({ message: defaulterrors.message });
// };

// module.exports = errorMiddleware;

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
  });
};

module.exports = errorHandler;
