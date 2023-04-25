
import React, { Component, MouseEventHandler, useEffect, useState } from 'react';
import { addToBasket, deleteBook, getBasket } from "../../requests/GenresController";
import jwt_decode from "jwt-decode";
import "./styles.css";
export interface IBasket {
  id: number;
  userId: string,
  books: IBook[]
}

interface IBook {
  id: number
  GenreId: number
  UserId: string
  Name: string
  Author: string
  Price: number
  Quality: string
}

interface MyToken {
  name: string;
  exp: number;
  sub: string;
}
export const BasketList = () => {
  const [basket, setBasket] = useState<IBasket | null>(null)
  const genreName = localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  const decodedToken = jwt_decode<MyToken>(user.accessToken);

  async function GetBasket() {
    const xd = await getBasket();
    //  setBasket(xd);
  }

  async function onBookDelete(BookId: number) {
    const genreId = parseInt(localStorage.getItem("genreId")!);
    await deleteBook(genreId, BookId);
    console.log('delete');
  };

  async function onAddToBasket(BookId: number) {
    const genreId = parseInt(localStorage.getItem("genreId")!);
    await addToBasket(BookId, genreId);
    console.log('delete');
  };

  useEffect(() => {
    GetBooks();
  }, []);

  // if (books.length === 0) {
  //   return <h1>loading</h1>;
  // }
  return (
    <div >
      <h3 className='d-flex justify-content-center'>{genreName}</h3>
      <table className='w-100'>
        <tbody>
          <tr id="header" className='bg-blue'>
            <td >Name</td>
            <td >Author</td>
            <td >Price</td>
            <td >Quality</td>
            <td >Upload date</td>
          </tr>
          {/* {books.map((x, index) => (
          <tr key={index} >
            <td style={{ color: 'black' }}>{x.name}</td>
            <td style={{ color: 'black' }}>{x.author}</td>
            <td style={{ color: 'black' }}>{x.price}</td>
            <td style={{ color: 'black' }}>{x.quality}</td>
            <td style={{ color: 'black' }}>{x.created.substring(0,10)}</td>
            <td>
            {x.userId == decodedToken.sub || localStorage.getItem('Role') == 'Admin'  ?
              <button onClick={() => onBookDelete(x.id)} className='btn btn-danger btn-sm rounded-0'>
                  <FaTrash />
              </button>
              :
              (
                <button onClick={() => onAddToBasket(x.id)} className='btn btn-primary btn-sm rounded-0'>
                  <FaShoppingBasket />
              </button>
              )
            }
            </td>
            
          </tr> */}
          ))
        </tbody>

      </table>
    </div>
  )
}

function GetBooks() {
  throw new Error('Function not implemented.');
}
