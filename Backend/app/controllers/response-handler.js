// setResponse: 200 Response handler for the API
export const setResponse = (data, response) => {
  response.status(200).json(data);
};
// setErrorResponse: 500 Response handler for the API
export const setErrorResponse = (error, response = false) => {
  response.status(500).json({
    status: "error",
    message: error,
  });
};
// setNotFoundResponse: 404 Response handler for the API
export const setNotFoundResponse = (response) => {
  response.status(404).json({
    status: "notfound",
    message: "Resource not found",
  });
};
// setUnauthorizedResponse: 401 Response handler for the API
export const setUnauthorizedResponse = (response) => {
  response.status(401).json({
    status: "unauthorized",
    message: "Invalid email or password",
  });
};

export const setUserExistsResponse = (response) => {
  response.status(409).json({
    status: "userexists",
    message: "User with this email already exists",
  });
};

export const setCreatedResponse = (data, response) => {
  response.status(201).json(data);
};

export const setUserDoenstExistResponse = (response) => {
  response.status(404).json({
    status: "userdoesntexist",
    message: "User With this email does not exist. Try creating a new account",
  });
};
