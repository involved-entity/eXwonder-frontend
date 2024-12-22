import axios from "axios";
import { ApiUrl } from "../settings.ts";
import { IDefaultAxiosInstanceOptions } from "../types/client";

function fetchClient() {
  const defaultOptions: IDefaultAxiosInstanceOptions = {
    baseURL: ApiUrl,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Token ${token}` : "";
    return config;
  });

  return instance;
}

export default fetchClient();
