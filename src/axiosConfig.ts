import axios, { AxiosResponse } from "axios";

export const axiosConfig = axios.create({
  baseURL: "https://localhost:7051/api",
  withCredentials: true,
});

axiosConfig.defaults.headers.common["Content-Type"] = "application/json";

const handleErr = (err: AxiosResponse<string, boolean>) => {
  if (err instanceof Error) {
    return { data: err.message, isError: true };
  }
  return err;
};
