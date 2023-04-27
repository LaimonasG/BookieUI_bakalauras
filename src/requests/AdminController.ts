

import axios from "axios"

const url="https://localhost:5001/api";
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
  await axios.post(`${url}/admin`, undefined).then(function (response) {
    console.log(response);
  })
    .catch(function (error) {
      console.log(error.response.data);
    });


  export {setUserRole}