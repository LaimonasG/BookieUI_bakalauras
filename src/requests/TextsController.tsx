import axios, { AxiosError } from "axios"
import { ITextAdd, ITextsBought } from "../Interfaces";
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

const updateText = async (genreName: string, text: ITextsBought, coverImage: File, content: File) => {
  try {
    const formData = new FormData();
    formData.append("File", content);
    formData.append("CoverImage", coverImage);
    formData.append("Name", text.name);
    formData.append("Price", text.price.toString());
    formData.append("Description", text.description);

    const response = await axios
      .put(`${url}/genres/${genreName}/texts/${text.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    if (response.status === 200) {
      return 'success';
    } else {
      return 'Error status' + response.status.toString();
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
    let errorDataString;
    if (axiosError.response && axiosError.response.status === 400) {
      errorDataString = JSON.stringify(axiosError.response.data).replace(/^"|"$/g, '');
      return errorDataString;
    }
    if (axiosError.response && axiosError.response.status === 401) {
      return "Norėdami pirkti tekstą turite prisijungti.";
    }
    console.error(error);
    return 'error';
  }
};


export { getAllTexts, addText, purchaseText, updateText }

