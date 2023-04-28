import axios from "axios";
import { IAnsweredQuestionDto, IQuestion, IBookAdd, IPersonalInfo } from "../Interfaces";
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";

const url = "https://localhost:7010/api";
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

  const updatePersonalInfo = async (dto:IPersonalInfo): Promise<IPersonalInfo> =>
  await axios.put(`${url}/profiles/info`, {
    data: {
      "Username": dto.userName,
      "Email": dto.email,
      "Name":dto.name,
      "Surname":dto.userName
    }
  }).then((x) => x.data); 

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
    data: {
      "QuestionID": questionId,
      "AnswerID": answerId
    }
  }).then((x) => x.data); 

export { getTodaysQuestion, getLastAnswerTime, answerQuestion,getProfile,updatePersonalInfo,getProfileBooks,getProfileTexts };