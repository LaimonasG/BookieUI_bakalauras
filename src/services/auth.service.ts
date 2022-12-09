import axios from "axios";

const API_URL = "https://localhost:7051/api";

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "/register", {
    username,
    email,
    password,
  })
  .then((res) => {
    
    if (res) {
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log('labas');
      console.log(localStorage.getItem("user"));
    }
    return res;
  })
  ;
};

export const login = (username: string, password: string) => {
  return axios
    .post(API_URL + "/login", {
      username,
      password,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};