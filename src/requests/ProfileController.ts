import axios from "axios"
import { IBookAdd } from "../Interfaces";
import { toast } from 'react-toastify';

const url="https://localhost:7010/api";
const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

const getTodaysQuestion = async (date: string) =>
  await axios.get(`${url}/profiles/dailyQuestion`, undefined).then((x) => x.data);

const getLastAnswerTime = async () =>
await axios.get(`${url}/profiles/dailyQuestion/time`, undefined).then((x) => x.data);

const answerQuestion = async (questionId: number, AnswerId: number) =>
  await axios.put(`${url}/profiles/dailyQuestion/time`, undefined).then((x) => x.data);

  export {getTodaysQuestion,getLastAnswerTime, answerQuestion}

