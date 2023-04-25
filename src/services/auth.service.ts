import axios from "axios";
import jwt_decode from "jwt-decode";

const API_URL = "https://localhost:7010/api";

export const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "/register", {
    username,
    email,
    password,
  })
  .then((res) => {
    
    if (res) {
      localStorage.setItem("user", JSON.stringify(res.data));
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
      console.log("Prisijungimo duomenys:",response.data)
      if (response.data.accessToken) {
        const decodedToken: any = jwt_decode(response.data.accessToken);
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        let assignedRole = '';

        if (roles.includes('BookieAdmin')) {
          assignedRole = 'BookieAdmin';
        } else if (roles.includes('BookieWriter')) {
          assignedRole = 'BookieWriter';
        } else if (roles.includes('BookieReader')) {
          assignedRole = 'BookieReader';
        } else if (roles.length === 1 && roles[0] === 'BookieUser') {
          assignedRole = 'BookieUser';
        } else {
          assignedRole = 'NoRole';
        }

        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("role", assignedRole);
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};