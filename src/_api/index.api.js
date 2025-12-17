import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL;
// import { toast } from "react-toastify";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export class HttpClient {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
    });
    this._initializeResponseInterceptor();
  }

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  _handleResponse = (response) => {
    const { data } = response;
    
    //   Show toast message globally based on API response
    if (data.status === "success") {
      // toast.success(capitalize(data.message) || "Request successful!");
    } else if (data.status === "fail" || data.status === "error") {
      // toast.error(capitalize(data.message) || "Something went wrong!");
    }

    return data; // Return the actual response data
  }

  _handleError = async ({ response, config }) => {
    const originalRequest = config;
    
    // console.log("config handleError:", response, config)

    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // toast.error("Session expired! Please log in again.");
      return this.instance(originalRequest);
    }
    
    // toast.error(response?.data?.message || "An unexpected error occurred!");

    return Promise.reject(response);
  };
  
}

export default HttpClient;