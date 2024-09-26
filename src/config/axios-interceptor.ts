import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AUTH_TOKEN_KEY } from "../shared/util/LocalStorage";
import { Storage } from "../shared/util/LocalStorage";

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
console.log("🚀 ~ axios.defaults.baseURL:", axios.defaults.baseURL);

if (import.meta.env.MODE === "development") {
  axios.defaults.baseURL = import.meta.env.VITE_API_DEV_URL;
  console.log("Development ortamında çalışıyor");
} else if (import.meta.env.MODE === "production") {
  axios.defaults.baseURL = import.meta.env.VITE_API_PROD_URL;
  console.log("Production ortamında çalışıyor");
} else {
  axios.defaults.baseURL = "http://localhost:8080";
  console.log(`Custom mod: ${import.meta.env.MODE}`);
}

const setupAxiosInterceptors = (onUnauthenticated) => {
  const onRequestSuccess = (config: AxiosRequestConfig<any>) => {
    const token =
      Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Accept-Language"] = "en-US";
    }

    return config;
  };

  const onResponseSuccess = (response: AxiosResponse<any, any>) => {
    return response;
  };
  const onResponseError = (err: any) => {
    const status = err.status || (err.response ? err.response.status : 0);
    // if (status === 403 || status === 401) {
    //   onUnauthenticated();
    // }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
