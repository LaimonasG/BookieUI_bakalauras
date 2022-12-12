import { axiosConfig} from "../axiosConfig";
import axios from "axios"

interface IBooks {
  id: number;
  GenreId: number;
  UserId: string;
  Name: string;
  Author: string;
  Price:number;
  Quality:string;
}
const url="https://localhost:7051/api";
const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);




if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

const getAllGenres = async () => await axios.get(`${url}/genres`, undefined).then((x) => x.data);
const getAllBooks = async (id: number) =>
  await axios.get(`${url}/genres/${id}/books`, undefined).then((x) => x.data);

const addBook = async (id: number, book: IBooks) =>
  await axios.post(`${url}/genres/${id}/books`, {
    "Name": book.Name,
    "Author": book.Author,
    "Price":book.Price,
    "Quality":book.Quality,
    "content-type":"application/json",
    "certifiedToPost":"yes",
    "role":"User"}).then(function (response) {
      console.log(response);
    })
      .catch(function (error) {
        console.log(error.response.data);
      });

const editBook = async (idGenre: number, idBook: number, book: IBooks) =>
  await axios.put(`${url}/genres/${idGenre}/books/${idBook}`, undefined);

  const deleteBook = async (idGenre: number, idBook: number) =>
  await axios.delete(`${url}/genres/${idGenre}/books/${idBook}`, undefined);

  const getBasket = async () =>
  await axios.get(`${url}/baskets`, undefined);

  const createBasket = async () =>
  await axios.post(`${url}/baskets`, undefined);

export { getAllGenres, getAllBooks, addBook, editBook,deleteBook,getBasket,createBasket };
