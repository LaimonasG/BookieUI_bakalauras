
import React, { Component, MouseEventHandler, useEffect, useState } from 'react';
import { getAllBooks,deleteBook } from "../../requests/genres";
export interface IBook {
    id: number,
    "name": string,
    "genreID": number,
    "author": string,
    "created": string,
    "userId":string
}
export const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([])
  const userStr = localStorage.getItem("user");
  let user=null;
  if (userStr)
    user = JSON.parse(userStr);

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

    useEffect(() => {
        GetBooks();
      }, []);

      if (books.length === 0) {
        return <h1>loading</h1>;
      }
    return (
        <div className="mt-5 d-flex w-100">
          <table className='w-100'>
                  {books.map((x, index) => (
          <tr key={index} >
            <td style={{ color: 'black' }}>{x.name}</td>
            <td style={{ color: 'black' }}>{x.author}</td>
            <td style={{ color: 'black' }}>{x.created.substring(0,10)}</td>
            <td style={{ color: 'red' }}>{x.userId}</td>
            <td style={{ color: 'red' }}>{user.UserId}</td>
            {x.userId == user.UserId || localStorage.getItem('Role') == 'Admin'  &&
              <button onClick={() => onBookDelete(x.id)} className='btn'>
                  Delete
              </button>
            }
          </tr>
        ))}
        </table>
        </div>
    )
}