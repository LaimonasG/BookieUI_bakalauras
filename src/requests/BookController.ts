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
const url="https://localhost:7010/api";
const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

const getAllBooksFinished = async (genreName: string) =>
  await axios.get(`${url}/genres/${genreName}/books/finished`, undefined).then((x) => x.data);

const getAllBooksUnfinished = async (genreName: string) =>
await axios.get(`${url}/genres/${genreName}/books/unfinished`, undefined).then((x) => x.data);

const addBook = async (genreName: string, book: IBooks) =>
  await axios.post(`${url}/genres/${genreName}/books`, {
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

const editBook = async (genreName: string, idBook: number, book: IBooks) =>
  await axios.put(`${url}/genres/${genreName}/books/${idBook}`, undefined);

  const deleteBook = async (genreName: string, idBook: number) =>
  await axios.delete(`${url}/genres/${genreName}/books/${idBook}`, undefined);

  const addToBasket = async (idBook: number, genreName: string) =>
  await axios.put(`${url}/baskets`, 
  {
    "bookId":idBook,
    "genreName":genreName,
    "content-type":"application/json",
  }).then(function (response) {
    console.log(response);
  })
    .catch(function (error) {
      console.log(error.response.data);
    });

  export {getAllBooksFinished,getAllBooksUnfinished, addBook, editBook,deleteBook,addToBasket}

