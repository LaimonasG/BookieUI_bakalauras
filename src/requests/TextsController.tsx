import axios from "axios"
import { ITextAdd } from "../Interfaces";
import { toast } from 'react-toastify';

const url = "https://localhost:7010/api";
const userStr = localStorage.getItem("user");


let user = null;
if (userStr)
  user = JSON.parse(userStr);

if (user)
  axios.defaults.headers.common = { 'Authorization': `bearer ${user.accessToken}` }

const getAllTexts = async (genreName: string) =>
  await axios.get(`${url}/genres/${genreName}/texts`, undefined).then((x) => x.data);

const addText = async (genreName: string, text: ITextAdd) => {
  const formData = new FormData();
  formData.append("File", text.content);
  formData.append("CoverImage", text.coverImage);
  formData.append("Name", text.name);
  formData.append("Price", text.price.toString());
  formData.append("Description", text.description);

  await axios
    .post(`${url}/genres/${genreName}/texts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      toast.error('Teksto įkelti nepavyko.', {
        position: 'bottom-center',
        autoClose: 3000, // milliseconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error.response.data);
    });
};

export { getAllTexts, addText }

