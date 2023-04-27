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
const url="https://localhost:5001/api";
const userStr = localStorage.getItem("user");


let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

const getAllGenres = async () => await axios.get(`${url}/genres`, undefined).then((x) => x.data);

  const getBasket = async () =>
  await axios.get(`${url}/baskets`, undefined);

  const createBasket = async () =>
  await axios.post(`${url}/baskets`, undefined);

    const getComments = async (genreId: number,bookId:number) =>
    await axios.get(`${url}/genres/${genreId}/books/${bookId}/comments`, undefined).then((x) => x.data);

export { getAllGenres, getBasket,createBasket,getComments };
