import axios, { AxiosError } from "axios";
import { IAnsweredQuestionDto, IQuestion, IBookAdd, IPersonalInfo, IPayment, ICreatePayment } from "../Interfaces";
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { url } from "../App";

const userStr = localStorage.getItem("user");

let user = null;
if (userStr) {
  user = JSON.parse(userStr);
}

if (user) {
  axios.defaults.headers.common = { 'Authorization': `bearer ${user.accessToken}` };
}

const getProfile = async () =>
  await axios.get(`${url}/profiles`).then((x) => x.data);

  const updatePersonalInfo = async (dto:IPersonalInfo) =>{
    try{
      const response=await axios.put(`${url}/profiles/info`, {
        "Username": dto.userName,
        "Email": dto.email,
        "Name":dto.name,
        "Surname":dto.surname
      
    }); 
    if (response.status === 200) {
      return 'success';
    } else {
      return 'failed';
    }
  }catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        const errorDataString = JSON.stringify(axiosError.response.data).replace(/^"|"$/g, '');
      return errorDataString;
      } else {
        console.error(error);
        return 'error';
      }
    }
  };
  
  

  const getProfileBooks = async () =>
  await axios.get(`${url}/profiles/books`).then((x) => x.data);

  const getProfileTexts = async () =>
  await axios.get(`${url}/profiles/texts`).then((x) => x.data);

const getTodaysQuestion = async (date: string): Promise<IQuestion> =>
  await axios.get(`${url}/profiles/dailyQuestion/${date}`).then((x) => x.data);

const getLastAnswerTime = async () =>
  await axios.get(`${url}/profiles/dailyQuestion/time`).then((x) => x.data);

const answerQuestion = async (questionId: number, answerId: number): Promise<IAnsweredQuestionDto> =>
  await axios.put(`${url}/profiles/dailyQuestion`, {
      "QuestionID": questionId,
      "AnswerID": answerId  
  }).then((x) => x.data); 

  const getAvailablePayments = async (): Promise<IPayment[]> =>
  await axios.get(`${url}/profiles/payForPoints`).then((x) => x.data);

  const payForPoints = async (paymentId: number): Promise<string> => {
    try {
      const response = await axios.put(`${url}/profiles/payForPoints/${paymentId}`, {
        data: {
          "PaymentId": paymentId
        }
      });
  
      if (response.status === 200) {
        return 'success';
      } else {
        return 'failed';
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        const errorDataString = JSON.stringify(axiosError.response.data).replace(/^"|"$/g, '');
      return errorDataString;
      } else {
        console.error(error);
        return 'error';
      }
    }
  };
  
export { getTodaysQuestion, getLastAnswerTime, answerQuestion,getProfile,updatePersonalInfo,getProfileBooks,getProfileTexts,getAvailablePayments,payForPoints };