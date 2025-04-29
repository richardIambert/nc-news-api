export const handleError = (error, request, response, next) => {
  const { status = 500, message = 'internal server error' } = error;
  console.log(error);
  return response.status(status).json({ message });
};
