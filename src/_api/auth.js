
import ApiRoutes from "../config/endpoint.config"; // Import the API Routes
import { getTokenLocal } from "../utils/localstorage.util";
import HttpClient from "./index.api";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

class Auth extends HttpClient {
  constructor() {
    super(baseURL);
    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use((config) => {
      config.headers["Authorization"] = `Bearer ${getTokenLocal() || ""}`;
      config.headers["authKey"] = process.env.NEXT_PUBLIC_API_AUTH_KEY;
      config.headers["Content-Type"] = "application/json";

      return config;
    });
  };

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      async (response) => {
        let data;
        if (response) {
          data = await response; // Decrypt response body
          if (data.status == "success") {
          } else if (data.status == "fail") {
            console.log("Auth api data.message:", data.message)
            // toast.error(data.message);
          }
        } else {
          // toast.error(response.message);
          console.log("No  found in response.");
        }
        return data;
      },
      (error) => Promise.reject(error)
    );
  };

  // **Auth APIs with Encrypted Requests**
  login = async (reqBody) => {
    console.log("login reqBody------------", reqBody)
    return this.instance({
      method: ApiRoutes.Auth.Login.Method,
      url: ApiRoutes.Auth.Login.Endpoint,
      data: reqBody,
    });
  };
  generateCRN = async (reqBody) => {
    console.log("generateCRN reqBody------------", reqBody)
  
    return this.instance({
      method: ApiRoutes.Auth.GenerateCRN.Method,
      url: ApiRoutes.Auth.GenerateCRN.Endpoint,
      data: reqBody,
    })
  }
  getProduct = async (reqBody) => {
    console.log("get product reqbody-------------", reqBody);
  return this.instance({
    method: ApiRoutes.Auth.GetProduct.Method,
    url: ApiRoutes.Auth.GetProduct.Endpoint(reqBody.city),
    data: reqBody,
  });
};
 generateQuotation = async (reqBody) => {
    console.log("get product reqbody-------------", reqBody);
  return this.instance({
    method: ApiRoutes.Auth.GenerateQuotation.Method,
    url: ApiRoutes.Auth.GenerateQuotation.Endpoint,
    data: reqBody,
  });
};

}

//  Export an instance of the `Auth` class
const authInstance = new Auth();
export default authInstance;