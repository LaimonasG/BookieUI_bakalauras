import axios from "axios";
import jwt_decode from "jwt-decode";
import { url } from "../App";

interface DecodedToken {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string[];
  exp: number;
}

export const register = (username: string, email: string, password: string) => {
  return axios.post(url + "/register", {
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
  });
};

export const login = (username: string, password: string) => {
  return axios
    .post(url + "/login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        const decodedToken: DecodedToken = jwt_decode(response.data.accessToken);
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        let assignedRole = '';

        if (roles.includes('Admin')) {
          assignedRole = 'Admin';
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

const getTokenExpirationTime = (token: string): number => {
  const decodedToken: DecodedToken = jwt_decode(token);

  // Ensure the decoded token has the 'exp' property
  if (!Object.prototype.hasOwnProperty.call(decodedToken, 'exp')) {
    throw new Error('Token does not contain expiration time');
  }

  const exp: number = decodedToken.exp;
  return exp * 1000; // convert expiration time from seconds to milliseconds
};
export {getTokenExpirationTime};