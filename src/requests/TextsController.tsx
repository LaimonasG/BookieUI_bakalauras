import axios from "axios"

interface IBooks {
  id: number;
  GenreId: number;
  UserId: string;
  Name: string;
  Author: string;
  Price: number;
  Quality: string;
}
const url = "https://localhost:7010/api";
const userStr = localStorage.getItem("user");


let user = null;
if (userStr)
  user = JSON.parse(userStr);

if (user)
  axios.defaults.headers.common = { 'Authorization': `bearer ${user.accessToken}` }

const getAllTexts = async (genreName: string) =>
  await axios.get(`${url}/genres/${genreName}/texts`, undefined).then((x) => x.data);

export { getAllTexts }

