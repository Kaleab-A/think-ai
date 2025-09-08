import axios from "axios";
import { useStore } from "@/store/store";
import { CustomError } from "@/types/custom-error.type";
import { ENV } from "./get-env";

const baseURL = ENV.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

//*** FOR API WITH TOKEN */
export const API = axios.create(options);

API.interceptors.request.use((config) => {
  const accessToken = useStore.getState().accessToken;
  if (accessToken) {
    config.headers["Authorization"] = "Bearer " + accessToken;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // When the request never reached the server (network error, CORS, etc.)
    // axios sets `error.request` and leaves `error.response` undefined. Guard for that case.
    const { response } = error;

    if (!response) {
      // Construct a minimal custom error and forward it
      const customError: CustomError = {
        ...error,
        message: error.message || "Network error",
        errorCode: "NETWORK_ERROR",
      };
      return Promise.reject(customError);
    }

    const { data, status } = response;
    if (data === "Unauthorized" && status === 401) {
      const store = useStore.getState();
      store.clearUser();
      store.clearAccessToken();
      store.clearExpiresAt();
      window.location.href = "/";
    }

    console.log(data, "data");
    const customError: CustomError = {
      ...error,
      message: data?.message || error.message,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

//*** FOR API DONT NEED TOKEN */
export const PublicAPI = axios.create(options);

PublicAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    // When the request never reached the server (network error, CORS, etc.)
    // axios sets `error.request` and leaves `error.response` undefined. Guard for that case.
    const { response } = error;

    if (!response) {
      const customError: CustomError = {
        ...error,
        message: error.message || "Network error",
        errorCode: "NETWORK_ERROR",
      };
      return Promise.reject(customError);
    }

    const { data } = response;
    const customError: CustomError = {
      ...error,
      message: data?.message,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };
    return Promise.reject(customError);
  }
);
