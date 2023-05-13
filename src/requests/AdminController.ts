

import axios, { AxiosError } from "axios"
import { url } from "../App";
import { IBookBought, IQuestion, IQuestionAdd, ITextsBought, IUser } from "../Interfaces";

const userStr = localStorage.getItem("user");

let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

interface ISetRoleDto {
  roleName: string
}

const getUserBlockedStatus = async ():Promise<boolean>=> {
  const response=await axios.get(`${url}/admin/isBlocked`, undefined);
  return response.data;
};

const getAllUsers = async ():Promise<IUser[]> =>
  await axios.get(`${url}/admin/users`, undefined).then((x) => x.data);

  const getAllQuestions = async ():Promise<IQuestion[]> =>
  await axios.get(`${url}/profiles/dailyQuestion/many`, undefined).then((x) => x.data);

  const getAllBooks = async ():Promise<IBookBought[]> =>
  await axios.get(`${url}/admin/submittedBooks`, undefined).then((x) => x.data);

  const getAllTexts = async ():Promise<ITextsBought[]> =>
  await axios.get(`${url}/admin/submittedTexts`, undefined).then((x) => x.data);

  const setBookStatus = async (status:number,statusComment:string,bookId:number) =>{
    try{
      const response=await axios.put(`${url}/admin/submittedBooks`, {
        "status":status,
        "bookId":bookId,
        "statusComment":statusComment
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

    const createQuestion = async (question:IQuestionAdd) =>{
      try{
        const response=await axios.post(`${url}/profiles/dailyQuestion`, {
          "Question":question.question,
          "Points":question.points,
          "DateToRelease":question.dateToRelease,
          "Answers":question.answers
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

      const removeQuestion = async (questionId:number) =>{
        try{
          const response=await axios.delete(`${url}/profiles/dailyQuestion/${questionId}`, undefined);
        
          if (response.status === 204) {
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

    const setTextStatus = async (status:number,statusComment:string,textId:number) =>{
      try{
        const response=await axios.put(`${url}/admin/submittedTexts`, {
          "status":status,
          "textId":textId,
          "statusComment":statusComment
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

const updateBlockedStatus = async (dto:IUser) =>{
try{
  const response=await axios.put(`${url}/admin/block`, {
    "id":dto.id,
    "userName":dto.userName,
    "isBlocked":dto.isBlocked,
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
    const response=await axios.put(`${url}/admin/points`, {
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
  await axios.post(`${url}/admin`, dto).then()
    .catch(function (error) {
      console.log(error.response.data);
    });


  export {setUserRole,getAllUsers,updateBlockedStatus,setUserPoints,getAllQuestions,getAllBooks,getAllTexts,setTextStatus,setBookStatus,createQuestion,
    removeQuestion,getUserBlockedStatus}