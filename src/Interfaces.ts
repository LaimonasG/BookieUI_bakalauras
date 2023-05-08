import { useEffect, useState } from 'react';
import { getTokenExpirationTime, getCurrentUser, logout } from './services/auth.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export interface IBookBought {
  id: number
  name: string
  chapters: IChapters[] | null;
  genreName: string
  description: string
  chapterPrice:number
  price: number
  created: Date
  userId: string
  author:string
  isFinished:number
  coverImageUrl:string
  status:IStatus
  statusMessage:string
}

export enum IStatus{
  Pateikta,
  Patvirtinta,
  Atmesta
}

export interface IBookToBuy {
  id: number
  name: string
  genreName: string
  description: string
  chapterPrice: number
  bookPrice: number
  chapterCount:number;
  created: Date
  userId: string
  author:string
  isFinished:number
  coverImageUrl:string
}

export interface IBookAdd {
  name: string
  description: string
  chapterPrice: string
  bookPrice: string
  coverImage: File
}

export interface ITextAdd {
  coverImage:File
  content:File
  name:string
  price:string
  description:string
}

export interface ITextsBought {
  id: number
  name: string
  genreName: string
  content: string
  description:string
  price: number
  created: Date
  userId: string
  coverImageUrl:string
  author:string
  status:IStatus
  statusMessage:string
}

export interface ITextsToBuy {
  id: number
  name: string
  description:string
  genreName: string
  price: number
  created: Date
  userId: string
  coverImageUrl:string
  author:string
}

export interface IChapters {
id:number
bookId:number
userId:string
name:string
content:string
}

export interface IChaptersAdd {
  bookId:number
  isFinished:number
  name:string
  content:File
  }

  export interface IChaptersAdded {
    bookId:number
    isFinished:number
    name:string
    content:File
    chargedUsersCount:number
    }

export interface ITexts {
  Id: number,
  Content: string,
}

export interface IBooks {
  id: number;
  GenreId: number;
  UserId: string;
  Name: string;
  Author: string;
  Price:number;
  Quality:string;
}

export interface ISetRoleDto {
  roleName: string
}

export interface MyToken {
  name: string;
  exp: number;
  sub: string;
}

export interface IGenres {
  id: number;
  name: string;
}

export interface IAnswer {
  id: number;
  content: string;
  correct:number;
}

export interface IAnswerAdd {
  content: string;
  correct:number;
}

export interface IAnsweredQuestionDto {
content:string;
correct:number;
}

export interface IQuestion {
  id: number;
  question: string;
  points:number;
  dateToRelease:Date;
  answers:IAnswer[];
}

export interface IQuestionAdd {
  question: string;
  points:number;
  dateToRelease:Date;
  answers:IAnswerAdd[];
}

export interface IProfile {
  id: number;
  name: string;
  surname:string;
  userName:string;
  email:string;
  points:number;
}

export interface IPersonalInfo {
  name: string;
  surname:string;
  userName:string;
  email:string;
}

export interface IPayment{
  id:number;
  points:number;
  price:number;
}

export interface ICreatePayment{
  points:number;
  price:number;
}

export interface IComment{
  id:number;
  entityId:number;
  entityType:string;
  date:Date;
  content:string;
  userId:string;
  username:string;
}

export interface ICreateComment{
Content:string;
}

export interface IUser{
  id:string;
  userName:string;
  email:string;
  isBlocked:number;
  points:number;
  }

export function getPointsWord(points: number) {
  if (points % 10 === 1 && points % 100 !== 11) {
    return "taškas";
  } else if (points % 10 >= 2 && points % 10 <= 9 && (points % 100 < 10 || points % 100 >= 20)) {
    return "taškai";
  } else {
    return "taškų";
  }
}

export function getAddedWord(points: number) {
  if (points===1) {
    return "pridėtas";
  } else if (points % 10 >= 2 && points % 10 <= 9 && (points % 100 < 10 || points % 100 >= 20)) {
    return "pridėti";
  } else {
    return "pridėta";
  }
}

export function getSubscriberWord(points: number) {
  if (points===1) {
    return "prenumeratorių";
  } else  {
    return "prenumeratorius";
  } 
}
export function handleConfirmed(message: string) {
  toast.success(message, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export function handleDenied(message: string) {
  toast.error(message, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export function handleBeingAdded(message: string) {
  let toastId: any = null;
  toastId=toast.info(message, {
    position: 'bottom-center',
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  return toastId;
}

export const useHandleAxiosError = () => {
  const navigate = useNavigate();

  const handleAxiosError = (error: AxiosError) => {
    console.log("h3i");

    if (error.response && error.response.status === 401) {
      console.log("hi");
      logout();
      navigate('/login');
    } else if (error.response && error.response.status === 400) {
      const errorDataString = JSON.stringify(error.response.data).replace(/^"|"$/g, '');
      return errorDataString;
    } else {
      console.error(error);
      return 'error';
    }
  };

  return handleAxiosError;
};


