

import axios from "axios"
import { url } from "../App";

const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

interface ISetRoleDto {
  roleName: string
}

const setUserRole = async (dto:ISetRoleDto) =>
  await axios.post(`${url}/admin`, dto).then(function (response) {
  })
    .catch(function (error) {
      console.log(error.response.data);
    });


  export {setUserRole}