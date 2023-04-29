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

  const getWriterTexts = async () =>
  await axios.get(`${url}/writer/texts`, undefined).then((x) => x.data);

  const getWriterBooks = async () =>
  await axios.get(`${url}/writer/books`, undefined).then((x) => x.data);

  const getWriterBook = async (bookId:number) =>
  await axios.get(`${url}/writer/books/${bookId}`, undefined).then((x) => x.data);

  const getWriterText = async (textId:number) =>
  await axios.get(`${url}/writer/texts/${textId}`, undefined).then((x) => x.data);

  const getBookChapters = async (bookId:number,genreName:string) =>
  await axios.get(`${url}/genres/${genreName}/books/${bookId}/chapters`, undefined).then((x) => x.data);


  export {getWriterTexts,getWriterBooks,getWriterText,getWriterBook,getBookChapters}