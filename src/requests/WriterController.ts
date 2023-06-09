import axios from "axios"
import { url } from "../App";
import { IChapters, RedeemPaymentResponse, WriterSalesData } from "../Interfaces";

const userStr = localStorage.getItem("user");

let user=null;
if (userStr)
  user = JSON.parse(userStr);

if(user)
axios.defaults.headers.common = {'Authorization': `bearer ${user.accessToken}`}

  const getWriterTexts = async () =>
  await axios.get(`${url}/writer/texts`, undefined).then((x) => x.data);

  const getWriterBooks = async () =>
  await axios.get(`${url}/writer/books`, undefined).then((x) => x.data);

  const getWriterBook = async (bookId:number) =>
  await axios.get(`${url}/writer/books/${bookId}`, undefined).then((x) => x.data);

  const getWriterText = async (textId:number) =>
  await axios.get(`${url}/writer/texts/${textId}`, undefined).then((x) => x.data);

  const getBookChapters = async (bookId:number,genreName:string) : Promise<IChapters> =>
  await axios.get(`${url}/genres/${genreName}/books/${bookId}/chapters`, undefined).then((x) => x.data);

  const getSalesData= async () :Promise<WriterSalesData> =>
  await axios.get(`${url}/writer/sales`, undefined).then((x) => x.data);

  const redeemPay = async (percent:number):Promise<RedeemPaymentResponse>=>
await axios.put(`${url}/writer/getPayment`, {
    "cashOutPercent": percent,
}).then((x) => x.data); 
  
const chargeUsers = async (bookId: number, chapterId: number): Promise<number> =>
await axios.put(`${url}/profiles/pay`, {
    "bookId": bookId,
    "chapterId": chapterId  
}).then((x) => x.data); 

  export {getWriterTexts,getWriterBooks,getWriterText,getWriterBook,getBookChapters,chargeUsers,getSalesData,redeemPay}