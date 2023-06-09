import axios, { AxiosError } from "axios"
import { IComment, ICreateComment } from "../Interfaces";
import { url } from "../App";

const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

const getTextComments = async (textId:number,genreName:string):Promise<IComment[]> =>
await axios.get(`${url}/genres/${genreName}/texts/${textId}/comments`, undefined).then((x) => x.data);

const getBookComments = async (bookId:number,genreName:string):Promise<IComment[]> =>
await axios.get(`${url}/genres/${genreName}/books/${bookId}/comments`, undefined).then((x) => x.data);

const getChapterComments = async (chapterId:number,bookId:number,genreName:string):Promise<IComment[]> =>
await axios.get(`${url}/genres/${genreName}/books/${bookId}/chapters/${chapterId}/comments`, undefined).then((x) => x.data);

const addTextComment= async (genreName: string, textId: number,dto:ICreateComment) => {
  try {
  const response=await axios
    .post(`${url}/genres/${genreName}/texts/${textId}/comments`, {
      "Content":dto.Content   
    });

    if (response.status === 201) {
      return 'success';
    } else {
      return 'Error status'+response.status.toString();
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

const addBookComment= async (genreName: string, bookId: number,dto:ICreateComment) => {
  try {
  const response=await axios
    .post(`${url}/genres/${genreName}/books/${bookId}/comments`, {
      "Content":dto.Content   
    });

    if (response.status === 201) {
      return 'success';
    } else {
      return 'Error status'+response.status.toString();
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

const addChapterComment= async (genreName: string, bookId: number,chapterId:number,dto:ICreateComment) => {
  try {
  const response=await axios
    .post(`${url}/genres/${genreName}/books/${bookId}/chapters/${chapterId}/comments`, {
      "Content":dto.Content   
    });

    if (response.status === 201) {
      return 'success';
    } else {
      return 'Error status'+response.status.toString();
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

  const deleteTextComment = async (genreName: string, textId: number) =>
  await axios.delete(`${url}/genres/${genreName}/texts/${textId}/comments`, undefined);


  export {getTextComments,getBookComments,getChapterComments,addTextComment,addBookComment,addChapterComment,deleteTextComment}

