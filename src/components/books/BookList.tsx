
import React, { Component, MouseEventHandler, useEffect, useState } from 'react';
import { getAllBooks,deleteBook } from "../../requests/genres";
import { FaTrash,FaShoppingBasket } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import "./styles.css";
export interface IBook {
    id: number,
    "name": string,
    "genreID": number,
    "author": string,
    "created": string,
    "userId":string
    "price":number,
    "quality":string
}

interface MyToken {
  name: string;
  exp: number;
  sub:string;
}
export const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([])
  const genreName=localStorage.getItem("genreName");
  const userStr = localStorage.getItem("user");
  let user=null;
  if (userStr)
    user = JSON.parse(userStr);

    const decodedToken = jwt_decode<MyToken>(user.accessToken);

    async function GetBooks() {
        const xd = await getAllBooks(parseInt(localStorage.getItem("genreId")!));
        console.log('role',localStorage.getItem('Role'))
        setBooks(xd);
      }

    async function onBookDelete (BookId:number) {
      const genreId=parseInt(localStorage.getItem("genreId")!);
      await deleteBook(genreId,BookId);
      console.log('delete');
    };

    async function onAddToBasket (BookId:number) {
      const genreId=parseInt(localStorage.getItem("genreId")!);
      await deleteBook(genreId,BookId);
      console.log('delete');
    };

    useEffect(() => {
        GetBooks();
      }, []);

      if (books.length === 0) {
        return <h1>loading</h1>;
      }
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
                  {books.map((x, index) => (
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
                <button onClick={() => onBookDelete(x.id)} className='btn btn-primary btn-sm rounded-0'>
                  <FaShoppingBasket />
              </button>
              )
            }
            </td>
            
          </tr>
        ))}
            </tbody>
        
        </table>
        </div>
    )
}