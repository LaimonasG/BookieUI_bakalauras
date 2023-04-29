import axios, { AxiosError } from "axios"
import { ITextAdd } from "../Interfaces";
import { toast } from 'react-toastify';
import { url } from "../App";

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

  try {
    const response = await axios
      .post(`${url}/genres/${genreName}/texts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

const purchaseText = async (textId: number, genreName: string): Promise<string> => {
  try {
    const response = await axios.put(`${url}/genres/${genreName}/texts/${textId}/buy`, undefined);

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


export { getAllTexts, addText, purchaseText }

