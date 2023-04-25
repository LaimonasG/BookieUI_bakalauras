import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://localhost:7010/api";

export const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

export const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};
