import axios from "axios";
import authHeader from "./auth-header";
import { url } from "../App";

export const getPublicContent = () => {
  return axios.get(url + "all");
};

export const getUserBoard = () => {
  return axios.get(url + "user", { headers: authHeader() });
};
