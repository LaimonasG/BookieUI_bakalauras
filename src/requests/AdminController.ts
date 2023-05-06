

import axios, { AxiosError } from "axios"
import { url } from "../App";
import { IQuestion, IUser } from "../Interfaces";

const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

interface ISetRoleDto {
  roleName: string
}

const getAllUsers = async ():Promise<IUser[]> =>
  await axios.get(`${url}/admin/users`, undefined).then((x) => x.data);

  const getAllQuestions = async ():Promise<IQuestion[]> =>
  await axios.get(`${url}/profiles/dailyQuestion/many`, undefined).then((x) => x.data);

const updateBlockedStatus = async (dto:IUser) =>{
try{
  const response=await axios.put(`${url}/admin/users/block`, {
    "id":dto.id,
    "userName":dto.userName,
    "email":dto.email,
    "isBlocked":dto.isBlocked,
    "points":dto.points
  });

  if (response.status === 200) {
    return 'success';
  } else {
    return 'Error status'+response.status.toString();
  }
} catch(error){
  const axiosError = error as AxiosError;
  if (axiosError.response && axiosError.response.status === 400) {
    const errorDataString = JSON.stringify(axiosError.response.data).replace(/^"|"$/g, '');
    return errorDataString;
  } else {
    console.error(error);
    return 'error';
  }
}};

const setUserPoints = async (dto:IUser) =>{
  try{
    const response=await axios.put(`${url}/admin/users/points`, {
      "id":dto.id,
      "userName":dto.userName,
      "email":dto.email,
      "isBlocked":dto.isBlocked,
      "points":dto.points
    });
  
    if (response.status === 200) {
      return 'success';
    } else {
      return 'Error status'+response.status.toString();
    }
  } catch(error){
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      const errorDataString = JSON.stringify(axiosError.response.data).replace(/^"|"$/g, '');
      return errorDataString;
    } else {
      console.error(error);
      return 'error';
    }
  }};

const setUserRole = async (dto:ISetRoleDto) =>
  await axios.post(`${url}/admin`, dto).then(function (response) {
  })
    .catch(function (error) {
      console.log(error.response.data);
    });


  export {setUserRole,getAllUsers,updateBlockedStatus,setUserPoints,getAllQuestions}