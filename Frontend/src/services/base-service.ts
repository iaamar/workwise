const baseURL = "http://localhost:3000/api";

// Function to handle HTTP PUT requests for updating data
export const update = async <T>(path: string, data: T): Promise<T> => {
  const response = await fetch(baseURL + path, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: T = await response.json();
  return result;
};

// Function to handle HTTP POST requests for creating new data
export const post = async <T>(path: string, data: T): Promise<T> => {
  const response = await fetch(baseURL + path, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: T = await response.json();
  return result;
};

// Function to handle HTTP DELETE requests for removing data
export const remove = async (path: string): Promise<void> => {
  const response = await fetch(baseURL + path, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
};

// Function to handle HTTP GET requests for retrieving data
export const get = async <T>(path: string): Promise<T> => {
  const response = await fetch(baseURL + path, {
    method: "GET",
    credentials: "include",
  });
  const data: T = await response.json();
  return data;
};

// Function to handle HTTP GET requests for retrieving data by ID
export const getById = async <T>(path: string): Promise<T> => {
  const response = await fetch(baseURL + path, {
    method: "GET",
    credentials: "include",
  });
  const data: T = await response.json();
  return data;
};

// Function to handle HTTP GET requests for searching data based on a query
export const search = async <T>(path: string, query: string): Promise<T> => {
  const response = await fetch(baseURL + path + query, {
    method: "GET",
    credentials: "include",
  });
  const data: T = await response.json();
  return data;
};
