export const withTryCatch = (fn) => {
  return (request, response, next) => {
    try {
      return fn(request, response, next);
    } catch (error) {
      return next(error);
    }
  };
};
