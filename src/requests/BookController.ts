import axios, { AxiosError } from "axios"
import { IBookAdd, IBookToBuy, IChaptersAdd } from "../Interfaces";
import { toast } from 'react-toastify';
import { url } from "../App";

interface IBooks {
  id: number;
  GenreId: number;
  UserId: string;
  Name: string;
  Author: string;
  Price:number;
  Quality:string;
}
const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

const getAllBooksFinished = async (genreName: string):Promise<IBookToBuy[]> =>
  await axios.get(`${url}/genres/${genreName}/books/finished`, undefined).then((x) => x.data);

const getAllBooksUnfinished = async (genreName: string):Promise<IBookToBuy[]> =>
await axios.get(`${url}/genres/${genreName}/books/unfinished`, undefined).then((x) => x.data);

const addBook = async (genreName: string, book: IBookAdd) => {
  try {
  const formData = new FormData();
  formData.append("Name", book.name);
  formData.append("Description", book.description);
  formData.append("ChapterPrice", book.chapterPrice.toString());
  formData.append("BookPrice", book.bookPrice.toString());
  formData.append("CoverImage", book.coverImage);

  const response=await axios
    .post(`${url}/genres/${genreName}/books`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200 || response.status === 201) {
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

const addChapter = async (chapter: IChaptersAdd, genreName: string) => {
  try {
    const formData = new FormData();
    formData.append("File", chapter.content);
    formData.append("Name", chapter.name);
    formData.append("IsFinished", chapter.isFinished.toString());

    const response = await axios.post(
      `${url}/genres/${genreName}/books/${chapter.bookId}/chapters`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return { errorMessage: '', chargedUsersCount: response.data.chargedUsersCount };
    } else {
      return { errorMessage: 'failed', chargedUsersCount: 0 };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      const errorDataString = JSON.stringify(axiosError.response.data).replace(/^"|"$/g, '');
      return { errorMessage: errorDataString, chargedUserCount: 0 };
    } else {
      console.error(error);
      return { errorMessage: 'error', chargedUserCount: 0 };
    }
  }
};

const editBook = async (genreName: string, idBook: number, book: IBooks) =>
  await axios.put(`${url}/genres/${genreName}/books/${idBook}`, undefined);

  const deleteBook = async (genreName: string, idBook: number) =>
  await axios.delete(`${url}/genres/${genreName}/books/${idBook}`, undefined);

  const purchaseBook = async (bookId: number, genreName: string): Promise<string> => {
    try {
      const response = await axios.put(`${url}/genres/${genreName}/books/${bookId}/buy`, undefined);
  
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

  const subscribeToBook = async (bookId: number, genreName: string): Promise<string> => {
    try {
      const response = await axios.put(`${url}/genres/${genreName}/books/${bookId}/subscribe`, undefined);
  
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

  export {getAllBooksFinished,getAllBooksUnfinished, addBook, editBook,deleteBook,purchaseBook,subscribeToBook,addChapter}

