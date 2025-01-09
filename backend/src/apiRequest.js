import axios from "axios";
import { toast } from "react-toastify";

// Backend base URL from environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      // Add the Authorization header with the token
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Content-Type and Accept headers
    config.headers["Accept"] = "application/json";

    return config;
  },
  (error) => {
    // Handle the request error
    return Promise.reject(error);
  }
);

const apiRequest = {
  // POST request
  post: async (url, data = {}, query = {}, headers = {}) => {
    try {
      const response = await axiosInstance.post(url, data, {
        params: query, // Add query parameters
        headers,
      });

      // Success toast
      //Note : Error on toggle
      toast.success(response.data.msg, {
        position: "top-right",
        autoClose: 3000,
      });

      return response.data;
    } catch (error) {
      handleError(error);
      // throw error;
    }
  },

  // GET request
  get: async (url, query = {}, headers = {}) => {
    try {
      const response = await axiosInstance.get(url, {
        params: query, // Add query parameters
        headers,
      });

      return response.data;
    } catch (error) {
      handleError(error);
      // throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, query = {}, headers = {}) => {
    try {
      const response = await axiosInstance.put(url, data, {
        params: query, // Add query parameters
        headers,
      });

      // Success toast
      toast.success(response.data?.msg, {
        position: "top-right",
        autoClose: 3000,
      });

      return response.data;
    } catch (error) {
      handleError(error);
      // throw error;
    }
  },

  // DELETE request
  delete: async (url, query = {}, headers = {}) => {
    try {
      const response = await axiosInstance.delete(url, {
        params: query, // Add query parameters
        headers,
      });

      // Success toast
      toast.success(response.data?.msg, {
        position: "top-right",
        autoClose: 3000,
      });

      return response.data;
    } catch (error) {
      handleError(error);
      // throw error;
    }
  },
};

// Error handler for logging and displaying toast
const handleError = (error) => {
  if (error.response) {
    if (error.response.data?.errors) {
      const errors = error.response.data?.errors;
      return errors.forEach((item) => {
        toast.error(`Error: ${item.msg}`, {
          position: "top-right",
          autoClose: 5000,
        });
      });
    }

    if (error.response.data?.error) {
      return toast.error(error.response.data?.error);
    }
    if (error.response.data?.msg) {
      return toast.error(
        `Error: ${error.response.data.msg || "Something went wrong"}`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
    // Server responded with a status code that falls out of the range of 2xx
    toast.error(`Error: Something went wrong`, {
      position: "top-right",
      autoClose: 5000,
    });
  } else if (error.request) {
    // Request was made but no response
    toast.error("No response from the server", {
      position: "top-right",
      autoClose: 5000,
    });
  } else {
    // Something else happened
    console.log(error);
    toast.error(`Error: ${error.message}`, {
      position: "top-right",
      autoClose: 5000,
    });
  }
};

export default apiRequest;
